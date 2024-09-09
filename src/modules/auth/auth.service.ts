import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../common/entity/user-type';
import { SecretManager } from 'src/utils/secret-manager.utils';
import type { AdminUser } from 'src/database/models/admin.user.model';
import type { User } from 'src/database/models/user.model';
import type { CommonTypes } from 'src/types/common.types';
import { AdminDbService } from 'src/database/services/admin.db.service';
import { UserDbService } from 'src/database/services/user.db.service';
@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private secretManager: SecretManager,
    private userDbService: UserDbService,
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
  }): Promise<User | AdminUser | null> {
    console.log({ userType, email, secret });
    let user: User | AdminUser | null = null;

    if (!userType || !email || !secret) {
      return null;
    }
    if (userType === UserType.STUDENT) {
      user = await this.userDbService.findUserByEmail(email);
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
  public async preValidateUser({
    userType,
    email,
    secret,
  }: {
    userType: UserType;
    email?: string;
    secret?: string;
  }): Promise<User | null> {
    let user: User | null = null;

    if (email && secret && userType === UserType.STUDENT) {
      user = await this.userDbService.findUserByEmail(email);

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
  public async signJwtForUser(user: CommonTypes.ValidationPayload): Promise<CommonTypes.IUser> {
    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
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
