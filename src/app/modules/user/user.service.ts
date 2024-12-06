import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Student } from '../student.model';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

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
  // set manually generated id
  userData.id = generateStudentId(admissionSemester);

  // create a user model
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    payLoad.id = newUser.id;
    payLoad.user = newUser._id; // reference _id

    const newStudent = await Student.create(payLoad);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
