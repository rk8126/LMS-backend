import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../../common/entity/user-type';
import type { AdminUser } from 'src/database/models/admin.user.model';

/**
 * Implements passport-local strategy for user/secret authentication
 */
@Injectable()
export class AdminUserLocalStrategy extends PassportStrategy(Strategy, 'admin-user') {
  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'secret',
    });
  }

  public async validate(email: string, secret: string): Promise<AdminUser> {
    try {
      const adminUser = await this.authService.validateUser({
        userType: UserType.ADMIN_USER,
        email,
        secret,
      });

      if (!adminUser) {
        throw new UnauthorizedException();
      }
      return adminUser as AdminUser;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
