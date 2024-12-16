import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistration.create();
  },
);
