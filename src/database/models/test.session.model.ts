import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';

export type TestSessionDocument = TestSession & Document;

@Schema({ timestamps: true })
export class TestSession {
  @Prop({ type: Types.ObjectId, ref: 'Test', required: true })
  public testId: Types.ObjectId; // Reference to the Test schema

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  public studentId: Types.ObjectId; // Reference to the Student schema

  @Prop({
    type: [
      {
        questionId: { type: Types.ObjectId, ref: 'Question', required: true },
        isCorrect: { type: Boolean, required: true },
        difficulty: { type: Number, required: true },
      },
    ],
    required: true,
  })
  public answers: Array<{ questionId: Types.ObjectId; isCorrect: boolean; difficulty: number }>; // Array of answers with correctness

  @Prop({ type: Number, required: true, default: 5 })
  public currentDifficulty: number; // Track the current difficulty level

  @Prop({ type: Number, required: true, default: 0 })
  public consecutiveCorrectAnswers: number; // Track consecutive correct answers of difficulty 10

  @Prop({ type: Number, required: true, default: 0 })
  public totalQuestionsAttempted: number; // Track the total questions attempted
}

export const TestSessionSchema = SchemaFactory.createForClass(TestSession);

// Add a unique index to enforce the constraint
TestSessionSchema.index({ studentId: 1, testId: 1 }, { unique: true });
