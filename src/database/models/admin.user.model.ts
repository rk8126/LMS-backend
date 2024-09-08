import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { CommonConstants } from 'src/modules/common/constants/common.constants';

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: true })
export class AdminUser {
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

  @Prop({ type: Boolean, default: false })
  public isSuperAdmin: boolean;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
