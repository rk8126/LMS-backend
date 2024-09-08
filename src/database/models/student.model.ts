import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { CommonConstants } from 'src/modules/common/constants/common.constants';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: String, required: true, trim: true })
  public fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (str: string): boolean => CommonConstants.EMAIL_REGEX.test(str),
      message: (props: { value: string }) => `${props.value} is not a valid email`,
    },
  })
  public email: string;

  @Prop({ type: String, required: true, trim: true })
  public secret: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
