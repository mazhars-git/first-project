import AppError from '../../errors/appErrors';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUserInDB = async (payLoad: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payLoad.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // const isUserExists = await User.findOne({ id: payLoad?.id });
  // if (!isUserExists) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  // }

  // // checking if the user is already deleted

  // const isDeleted = isUserExists?.isDeleted;
  // if (isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  // }

  // // checking the user is blocked

  // const userStatus = isUserExists?.status;
  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  // }

  // checking the password is correct

  if (!User.isPasswordMatched(payLoad?.password, user?.password)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }
  // access granted:

  return {};
};

export const AuthServices = {
  loginUserInDB,
};
