import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9] | 2[0-3]): [0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format, expected "HH:MM" in 24 hours format',
        },
      ), // HH: MM   00-23: 00-59
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9] | 2[0-3]): [0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format, expected "HH:MM" in 24 hours format',
        },
      ), // HH: MM   00-23: 00-59,
    })
    .refine(
      (body) => {
        const start = new Date(`1992-01-01t${body.startTime}`);
        const end = new Date(`1992-01-01t${body.endTime}`);

        return end > start;
      },
      {
        message: 'Start time should be before end time!',
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
};
