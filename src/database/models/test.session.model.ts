import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type TestSessionDocument = TestSession & Document;

@Schema({ timestamps: true })
export class TestSession {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Test', required: true })
  public testId: Types.ObjectId; // Reference to the Test schema

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  public userId: Types.ObjectId; // Reference to the User schema

  @Prop({
    type: [
      {
        questionId: { type: SchemaTypes.ObjectId, ref: 'Question', required: true },
        isCorrect: { type: Boolean, required: true },
        difficulty: { type: Number, required: true },
        _id: false,
      },
    ],
    required: true,
  })
  public answers: Array<{ questionId: Types.ObjectId; isCorrect: boolean; difficulty: number }>; // Array of answers with correctness

  @Prop({ type: Number, required: true, default: 0 })
  public currentDifficulty: number; // Track the current difficulty level

  @Prop({ type: Boolean, required: true, default: false })
  public isTestCompleted: boolean; // Track the total questions attempted
}

export const TestSessionSchema = SchemaFactory.createForClass(TestSession);

// Add a unique index to enforce the constraint
TestSessionSchema.index({ userId: 1, testId: 1 }, { unique: true });
