import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
    throw new Error('Invalid semester code');
  }
  const result = await AcademicSemester.create(payLoad);
  return result;
};
const getSingleAcademicSemesterFromDB = async (payLoad: TAcademicSemester) => {
  const result = await AcademicSemester.findOne(payLoad);
  return result;
};
const getAllAcademicSemestersFromDB = async (payLoad: TAcademicSemester) => {
  const result = await AcademicSemester.find(payLoad);
  return result;
};
const updateAcademicSemestersInDB = async (payLoad: TAcademicSemester) => {
  const result = await AcademicSemester.find(payLoad);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getSingleAcademicSemesterFromDB,
  getAllAcademicSemestersFromDB,
  updateAcademicSemestersInDB,
};
