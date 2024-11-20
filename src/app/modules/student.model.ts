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
});
