import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { CommonConstants } from 'src/modules/common/constants/common.constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
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

export const UserSchema = SchemaFactory.createForClass(User);
