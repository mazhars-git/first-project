import AppError from '../../errors/appErrors';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';

const createOfferedCourseIntoDB = async (payLoad: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
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
    await SemesterRegistration.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty is not found!');
  }

  // if academic department is exists
  const isAcademicDepartmentExists =
    await SemesterRegistration.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found!',
    );
  }

  // if course is exists
  const isCourseExists = await SemesterRegistration.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }
  // if course is exists
  const isFacultyExists = await SemesterRegistration.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }

  const result = await OfferedCourse.create({ ...payLoad, academicSemester });
  return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
};
