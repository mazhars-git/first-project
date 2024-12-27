import mongoose from 'mongoose';
import config from '../../config';
import httpStatus from 'http-status';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Student } from '../student/student.model';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/appErrors';
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { Admin } from '../Admin/admin.model';
import { TAdmin } from '../Admin/admin.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  password: string,
  payLoad: TStudent,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if pass is not give, use default pass

  userData.password = password || (config.default_password as string);

  // set user role and email
  userData.role = 'student';
  userData.email = payLoad.email;

  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set manually generated id
    userData.id = await generateStudentId(admissionSemester);

    const imageName = `${userData.id}${payLoad.name.firstName}`;
    const path = file?.path;
    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);

    // create a user model
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    {
      payLoad.id = newUser[0].id;
      payLoad.user = newUser[0]._id; // reference _id
      payLoad.profileImg = secure_url;

      const newStudent = await Student.create([payLoad], { session });
      if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;
    }
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// create faculty

const createFacultyIntoDB = async (password: string, payLoad: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';
  userData.email = payLoad.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payLoad.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payLoad], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// create admin into db

const createAdminIntoDB = async (password: string, payLoad: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set admin role and email
  userData.role = 'admin';
  userData.email = payLoad.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payLoad], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// get me

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;
  // console.log(userId, role);

  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  // const result = await
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
