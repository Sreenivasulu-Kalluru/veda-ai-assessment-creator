import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAssignment extends Document {
  topic?: string;
  dueDate: string;
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true },
}, { _id: false });

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
}, { _id: false });

const AssignmentSchema = new Schema<IAssignment>({
  topic: { type: String },
  dueDate: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  sections: [SectionSchema],
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
