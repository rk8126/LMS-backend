/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../../common/entity/user-type';
import type { Student } from 'src/database/models/student.model';

/**
 * Implements passport-local strategy for user/secret authentication
 */
@Injectable()
export class PreLoginStrategy extends PassportStrategy(Strategy, 'pre-login') {
  private logger: Logger;

  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'secret',
    });

    this.logger = new Logger(PreLoginStrategy.name);
  }

  public async validate(email: string, secret: string): Promise<Student | null> {
    try {
      const user = await this.authService.preValidateStudent({
        email,
        secret,
        userType: UserType.STUDENT,
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      this.logger.error(`Unaauthentication failed: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
