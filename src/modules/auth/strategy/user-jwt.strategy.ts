import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { CommonTypes } from '../../../types/common.types';
import { UserDbService } from 'src/database/services/user.db.service';

/**
 * This strategy is applicable after the user is logged-in or the token is validated
 * So this validates the JWT token itself
 */
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  private logger: Logger;

  public constructor(
    private readonly configService: ConfigService,
    private readonly userDbService: UserDbService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    this.logger = new Logger(UserJwtStrategy.name);
  }

  public async validate(payload: CommonTypes.ValidationPayload): Promise<{
    _id: string;
    email: string;
    fullName: string;
  }> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { email, fullName } = payload;

    try {
      if (!payload._id) {
        throw new UnauthorizedException();
      }

      const user = await this.userDbService.findUserById(payload._id);
      if (!user || user.email !== email) {
        throw new UnauthorizedException();
      }

      return {
        _id: payload._id,
        email,
        fullName,
      };
    } catch (error) {
      this.logger.error('Error validating user', error);
      throw new UnauthorizedException();
    }
  }
}
