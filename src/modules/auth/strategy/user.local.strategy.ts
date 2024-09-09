import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../../common/entity/user-type';
import type { User } from 'src/database/models/user.model';

/**
 * Implements passport-local strategy for user/secret authentication
 */
@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'user') {
  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'secret',
    });
  }

  public async validate(email: string, secret: string): Promise<User> {
    try {
      const user = await this.authService.validateUser({
        userType: UserType.STUDENT,
        email,
        secret,
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
