import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../../common/entity/user-type';
import type { Student } from 'src/database/models/student.model';

/**
 * Implements passport-local strategy for user/secret authentication
 */
@Injectable()
export class StudentLocalStrategy extends PassportStrategy(Strategy, 'student') {
  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'secret',
    });
  }

  public async validate(email: string, secret: string): Promise<Student> {
    try {
      const student = await this.authService.validateUser({
        userType: UserType.STUDENT,
        email,
        secret,
      });

      if (!student) {
        throw new UnauthorizedException();
      }
      return student;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
