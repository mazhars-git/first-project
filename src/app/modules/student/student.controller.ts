/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { StudentService } from './student.service';
import sendResponse from '../../utils/sendRes';
import httpStatus from 'http-status';

const getAllStudents: RequestHandler = async (req, res, next) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err);
  }
};

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentsFromDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// delete

const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await StudentService.deleteStudentsFromDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
