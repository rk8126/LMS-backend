import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Types } from 'mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UserDbService {
  public constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  // Create a new user (registration)
  public async createUser({
    fullName,
    email,
    secret,
  }: {
    fullName: string;
    email: string;
    secret: string;
  }): Promise<User & { _id: Types.ObjectId }> {
    const newUser = await this.userModel.create({ fullName, email, secret });
    return newUser.toObject();
  }

  /**
   *  Fetch a user for a given email
   * @param email   Email of the user
   * @returns   User object
   */
  public async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.userModel.findOne({ email }).lean();
    console.log({ resultIsHere: result });
    return result;
  }

  /**
   *  Fetch a User for a given email
   * @param email   Email of the User
   * @returns   User object
   */
  public async findUserById(id: string): Promise<User | null> {
    const result = await this.userModel.findById(id).lean();
    return result;
  }
}
