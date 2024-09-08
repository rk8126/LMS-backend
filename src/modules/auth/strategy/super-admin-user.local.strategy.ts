import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import type { AdminUser } from 'src/database/models/admin.user.model';

/**
 * Implements passport-local strategy for user/secret authentication
 */
@Injectable()
export class SuperAdminUserLocalStrategy extends PassportStrategy(Strategy, 'super-admin-user') {
  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'secret',
    });
  }

  public async validate(email: string, secret: string): Promise<AdminUser> {
    try {
      console.log({ email, secret });
      const user = await this.authService.validateSuperAdminUser({
        email,
        secret,
      });
      if (!user || !user.isSuperAdmin) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
