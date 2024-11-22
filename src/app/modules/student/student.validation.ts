import Joi from 'joi';

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .max(20)
    .trim()
    .regex(
      /^[A-Z][a-z]*$/,
      'Proper format for first name (starts with uppercase letter)',
    ),
  midName: Joi.string().trim().optional(),
  lastName: Joi.string()
    .required()
    .trim()
    .regex(/^[A-Za-z]+$/, 'Last name should only contain alphabets'),
});

const guardianJoiSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContact: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContact: Joi.string().required(),
});

const localGuardianJoiSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  address: Joi.string().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required().max(255),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{VALUE} is not a valid gender',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    'string.email': '{VALUE} is not a valid email',
  }),
  contact: Joi.string().required(),
  emergencyContact: Joi.string().required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-').optional(),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianJoiSchema.required(),
  localGuardian: localGuardianJoiSchema.required(),
  profileImg: Joi.string().optional(),
  isActive: Joi.string()
    .valid('active', 'inActive')
    .default('active')
    .optional(),
});

export default studentValidationSchema;
