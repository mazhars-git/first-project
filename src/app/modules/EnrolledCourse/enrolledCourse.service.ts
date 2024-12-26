import AppError from '../../errors/appErrors';
import httpStatus from 'http-status';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payLoad: TEnrolledCourse,
) => {
  /**
   *
   * step1: check if the offered courses is exists
   * step2: check if the student is already enrolled
   * step3: create an enrolled course
   *
   */

  const { offeredCourse } = payLoad;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full!');
  }

  const student = await Student.findOne({ id: userId }).select('id');

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled!');
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
