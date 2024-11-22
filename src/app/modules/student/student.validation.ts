import { z } from 'zod';

// UserName Zod Schema
const userNameZodSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(20, { message: 'Max length is 20' })
    .trim(),
  midName: z.string().trim().optional(),
  lastName: z.string().min(1, { message: 'Last name is required' }).trim(),
});

// Guardian Zod Schema
const guardianZodSchema = z.object({
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
const localGuardianZodSchema = z.object({
  name: z.string().min(1, { message: 'Local guardian name is required' }),
  occupation: z
    .string()
    .min(1, { message: 'Local guardian occupation is required' }),
  address: z.string().min(1, { message: 'Local guardian address is required' }),
});

// Student Zod Schema
const studentZodValidationSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'ID is required' })
    .max(255, { message: 'ID can be a maximum of 255 characters' }),
  name: userNameZodSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' })
    .max(255, { message: 'Email can be a maximum of 255 characters' }),
  contact: z
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
  presentAddress: z.string().min(1, { message: 'Present address is required' }),
  permanentAddress: z
    .string()
    .min(1, { message: 'Permanent address is required' }),
  guardian: guardianZodSchema,
  localGuardian: localGuardianZodSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
});

export default studentZodValidationSchema;
