import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import AppError from '../errors/appErrors';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    next();
  });
};
