/* eslint-disable @typescript-eslint/no-explicit-any */
import { StudentService } from './student.service';
import sendResponse from '../../utils/sendRes';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// get all students
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

// get single student
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.getSingleStudentsFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

// delete student

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.deleteStudentsFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
