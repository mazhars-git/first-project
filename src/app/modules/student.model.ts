import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// import validator from 'validator';

import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student/student.interface';
import config from '../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true,
    maxlength: [20, 'Max length is 20'],
    // validate: function (value: string) {
    //   const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
    //   return firstNameStr === value;
    // },
    message: `{VaLUE} is not in proper format`,
  },
  midName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'first name is required'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: `{VALUE} is not valid`,
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContact: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContact: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not valid`,
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: `{VALUE} is not valid`,
      // },
    },
    contact: {
      type: String,
      required: true,
    },
    emergencyContact: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'inActive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual

studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.midName} ${this.name.lastName}`;
});
// pre save middleware/hook: will work on create() function

studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save data');
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing pass

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// post save middleware

studentSchema.post('save', function (doc, next) {
  doc.password = ' ';

  next();
});

// Query middleware

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// create a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// create a custom instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
