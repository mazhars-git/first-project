import { Schema, model, connect } from 'mongoose';
import { Student } from './student/student.interface';

const studentSchema = new Schema<Student>({
  id: { type: String },
  name: {
    firstName: {
      type: String,
      required: true,
    },
    midName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  gender: ['male', 'female'],
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  emergencyContact: { type: String, required: true },
  bloodGroup: ['A+', 'A-', 'B+', 'B-'],
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: {},
  localGuardian: {},
  profileImg: { type: String },
  isActive: ['active', 'inActive'],
});
