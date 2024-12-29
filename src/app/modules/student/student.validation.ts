import { z } from 'zod';

// UserName Zod Schema
const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(20, { message: 'Max length is 20' })
    .trim(),
  middleName: z.string(),
  lastName: z.string(),
});

// Guardian Zod Schema
const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  fatherOccupation: z
    .string()
    .min(1, { message: 'Father occupation is required' }),
  fatherContact: z.string().min(1, { message: 'Father contact is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  motherOccupation: z
    .string()
    .min(1, { message: 'Mother occupation is required' }),
  motherContact: z.string().min(1, { message: 'Mother contact is required' }),
});

// Local Guardian Zod Schema
const createLocalGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Student Zod Schema
export const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email({ message: 'Invalid email format' })
        .min(1, { message: 'Email is required' })
        .max(255, { message: 'Email can be a maximum of 255 characters' }),
      contactNo: z
        .string()
        .min(1, { message: 'Contact is required' })
        .max(255, { message: 'Contact can be a maximum of 255 characters' }),
      emergencyContact: z
        .string()
        .min(1, { message: 'Emergency contact is required' })
        .max(255, {
          message: 'Emergency contact can be a maximum of 255 characters',
        }),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-']).optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

// Update Validation Schema
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  midName: z.string().optional(),
  lastName: z.string().optional(),
});

// Guardian Zod Schema
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// Local Guardian Zod Schema
const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

// Student Zod Schema
export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional().optional(),
      email: z
        .string()
        .email({ message: 'Invalid email format' })
        .min(1, { message: 'Email is required' })
        .max(255, { message: 'Email can be a maximum of 255 characters' })
        .optional(),
      contact: z
        .string()
        .min(1, { message: 'Contact is required' })
        .max(255, { message: 'Contact can be a maximum of 255 characters' })
        .optional(),
      emergencyContact: z
        .string()
        .min(1, { message: 'Emergency contact is required' })
        .max(255, {
          message: 'Emergency contact can be a maximum of 255 characters',
        })
        .optional(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-']).optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' })
        .optional(),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' })
        .optional(),
      guardian: updateGuardianValidationSchema,
      localGuardian: updateLocalGuardianValidationSchema,
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
