import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

const findLastStudentId = async () => {};

export const generateStudentId = (payLoad: TAcademicSemester) => {
  const currentId = (0).toString().padStart(4, '0');
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`;

  return incrementId;
};
