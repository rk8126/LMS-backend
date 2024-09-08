import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser } from '../models/admin.user.model';

@Injectable()
export class AdminDbService {
  public constructor(
    @InjectModel(AdminUser.name)
    private adminUserModel: Model<AdminUser>
  ) {}

  public async createAdminUser({
    fullName,
    email,
    secret,
    isSuperAdmin,
  }: {
    fullName: string;
    email: string;
    secret: string;
    isSuperAdmin: boolean;
  }): Promise<AdminUser> {
    const adminUser = await this.adminUserModel.create({
      fullName,
      email,
      secret,
      isSuperAdmin,
    });
    return adminUser.toObject();
  }

  /**
   *  Fetch an admin user for a given email
   * @param email   Email of the admin user
   * @returns   AdminUser object
   */
  public async findAdminUserByEmail(email: string): Promise<AdminUser | null> {
    const result = await this.adminUserModel.findOne({ email }).lean();
    return result;
  }

  /**
   *  Fetch an admin user for a given email
   * @param email   Email of the admin user
   * @returns   AdminUser object
   */
  public async findAdminUserById(id: string): Promise<AdminUser | null> {
    const result = await this.adminUserModel.findById(id).lean();
    return result;
  }
}
