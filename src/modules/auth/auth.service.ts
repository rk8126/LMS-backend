import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../common/entity/user-type';
import { SecretManager } from 'src/utils/secret-manager.utils';
import type { AdminUser } from 'src/database/models/admin.user.model';
import type { Student } from 'src/database/models/student.model';
import type { CommonTypes } from 'src/types/common.types';
import { AdminDbService } from 'src/database/services/admin.db.service';
import { StudentDbService } from 'src/database/services/student.db.service';
@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private secretManager: SecretManager,
    private studentDbService: StudentDbService,
    private adminDbService: AdminDbService
  ) {}

  /**
   *  Validate user
   * @param email   User email
   * @param secret  User secret
   * @param userType  User type
   * @returns  User object
   */
  public async validateUser({
    userType,
    email,
    secret,
  }: {
    userType: UserType;
    email: string;
    secret: string;
  }): Promise<Student | AdminUser | null> {
    console.log({ userType, email, secret });
    let user: Student | AdminUser | null = null;

    if (!userType || !email || !secret) {
      return null;
    }
    if (userType === UserType.STUDENT) {
      user = await this.studentDbService.findStudentByEmail(email);
    }
    if (userType === UserType.ADMIN_USER) {
      user = await this.adminDbService.findAdminUserByEmail(email);
    }
    const match = user && (await this.secretManager.compareSecret(secret, user.secret));
    if (user && match) {
      return user;
    }
    return null;
  }

  /**
   * This function is used to pre-validate the user before login
   * @param param0
   * @returns
   */
  public async preValidateStudent({
    userType,
    email,
    secret,
  }: {
    userType: UserType;
    email?: string;
    secret?: string;
  }): Promise<Student | null> {
    let user: Student | null = null;

    if (email && secret && userType === UserType.STUDENT) {
      user = await this.studentDbService.findStudentByEmail(email);

      const match = user && (await this.secretManager.compareSecret(secret, user.secret));
      if (user && match) {
        return user;
      }
    }
    return null;
  }

  /**
   *  Validate super admin user
   * @param param0
   * @returns
   */
  public async validateSuperAdminUser({
    email,
    secret,
  }: {
    email: string;
    secret: string;
  }): Promise<AdminUser | null> {
    const user: AdminUser | null = await this.adminDbService.findAdminUserByEmail(email);

    const match = user && (await this.secretManager.compareSecret(secret, user.secret));
    if (user && match && user.isSuperAdmin) {
      return user;
    }

    return null;
  }

  /**
   *  Sign JWT for user
   * @param user   User object
   * @returns  JWT object
   */
  public async signJwtForStudent(
    student: CommonTypes.ValidationPayload
  ): Promise<CommonTypes.IStudent> {
    const payload = {
      _id: student._id,
      email: student.email,
      fullName: student.fullName,
    };

    const token = this.jwtService.sign(payload);

    console.log(payload, token);
    return {
      accessToken: token,
    };
  }

  /**
   *  Sign JWT for admin user
   * @param adminUser  Admin user object
   * @returns   JWT object
   */
  public async signJwtForAdminUser(
    adminUser: CommonTypes.ValidationPayload
  ): Promise<CommonTypes.IAdminUser> {
    const payload = {
      _id: adminUser._id,
      email: adminUser.email,
      fullName: adminUser.fullName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
