import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { CommonTypes } from '../../../types/common.types';
import { AdminDbService } from 'src/database/services/admin.db.service';

/**
 * This strategy is applicable after the user is logged-in or the token is validated
 * So this validates the JWT token itself
 */
@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  private logger = new Logger(AdminJwtStrategy.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly adminDbService: AdminDbService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  public async validate(payload: CommonTypes.ValidationPayload): Promise<
    | {
        _id: string;
        email: string;
        fullName: string;
      }
    | UnauthorizedException
  > {
    const { email, fullName } = payload;
    try {
      if (!payload._id) {
        throw new UnauthorizedException();
      }
      const adminUser = await this.adminDbService.findAdminUserById(payload._id);
      if (!adminUser || adminUser.email !== email) {
        throw new UnauthorizedException();
      }
      return {
        _id: payload._id,
        email: payload.email,
        fullName,
      };
    } catch (error) {
      this.logger.error('Error validating admin user', error);
      throw new UnauthorizedException();
    }
  }
}
