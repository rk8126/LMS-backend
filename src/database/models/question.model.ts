import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

// Enum for valid answers
// eslint-disable-next-line no-shadow
export enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: String, required: true, trim: true })
  public text: string;

  @Prop({ type: Number, required: true, min: 1, max: 100 })
  public score: number;

  @Prop({ type: Number, required: true, min: 1, max: 10 })
  public difficulty: number;

  @Prop({
    type: Object,
    required: true,
  })
  public options: {
    A: string;
    B: string;
    C: string;
    D: string;
  }; // Multiple choice options

  @Prop({
    type: String,
    required: true,
    enum: Object.values(AnswerOption),
  })
  public correctAnswer: AnswerOption; // Correct answer option

  @Prop({ type: Number, default: 0, min: 0, max: 10 })
  public weight: number; // Weight or importance of the question
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
