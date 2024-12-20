import AppError from '../../errors/appErrors';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const loginUserInDB = async (payLoad: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payLoad.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // // checking if the user is already deleted

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // // checking the user is blocked

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // checking the password is correct

  if (!User.isPasswordMatched(payLoad?.password, user?.password)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // create token and sent to the client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  console.log(userData);
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  // // checking if the user is already deleted

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // // checking the user is blocked

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // checking the password is correct

  if (!User.isPasswordMatched(payLoad.oldPassword, user?.password)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // hash new password

  const newHashedPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

export const AuthServices = {
  loginUserInDB,
  changePassword,
};
