import AppError from '../../errors/appErrors';
import httpStatus from 'http-status';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './OfferedCourse.utils';
import { Faculty } from '../Faculty/faculty.model';
import { Course } from '../Course/course.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';

const createOfferedCourseIntoDB = async (payLoad: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payLoad;

  // if semester registration id is exists
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  // if academic faculty is exists
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty is not found!');
  }

  // if academic department is exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found!',
    );
  }

  // if course is exists
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }
  // if course is exists
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists?.name} !`,
    );
  }

  // check same offered course same section in same registered semester is exists

  const isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exists!`,
    );
  }

  // get the schedules of the faculties

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.create({ ...payLoad, academicSemester });
  return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payLoad: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payLoad;

  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, `Offered course is not found!`);
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, `Faculty is not found!`);
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  // get the schedules of the faculties

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payLoad, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
