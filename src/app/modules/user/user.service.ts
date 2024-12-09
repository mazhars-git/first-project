import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Student } from '../student.model';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/appErrors';

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if pass is not give, use default pass

  userData.password = password || (config.default_password as string);

  // set user role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set manually generated id
    userData.id = await generateStudentId(admissionSemester);

    // create a user model
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    {
      payLoad.id = newUser[0].id;
      payLoad.user = newUser[0]._id; // reference _id

      const newStudent = await Student.create([payLoad], { session });
      if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;
    }
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student!!');
  }
};

export const UserServices = {
  createStudentIntoDB,
};
