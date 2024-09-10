import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document, Types } from 'mongoose';
import { SchemaTypes } from 'mongoose';

export type TestDocument = Test & Document;

@Schema({ timestamps: true })
export class Test {
  @Prop({ type: String, required: true, unique: true, trim: true })
  public uniqueURL: string; // Unique URL to access the test

  @Prop({ type: String, required: true, trim: true })
  public title: string; // Test title or name

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Question', required: true }], required: true })
  public questionIds: Types.ObjectId[]; // List of references to Question IDs

  @Prop({ type: Date, required: true })
  public deadline: Date; // Deadline for completing the test
}

export const TestSchema = SchemaFactory.createForClass(Test);
