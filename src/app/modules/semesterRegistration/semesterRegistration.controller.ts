import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { SemesterRegistrationServices } from './semesterRegistration.service';
import sendResponse from '../../utils/sendRes';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
};
