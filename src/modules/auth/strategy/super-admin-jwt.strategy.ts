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
export class SuperAdminJwtStrategy extends PassportStrategy(Strategy, 'super-admin-jwt') {
  private logger = new Logger(SuperAdminJwtStrategy.name);

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
    const { email } = payload;
    try {
      console.log({ email, file: 'Test' });
      if (!payload._id) {
        throw new UnauthorizedException();
      }
      const adminUser = await this.adminDbService.findAdminUserById(payload._id);
      console.log({ adminUser });
      if (!adminUser || adminUser.email !== email || !adminUser.isSuperAdmin) {
        throw new UnauthorizedException();
      }
      return {
        _id: payload._id,
        email: payload.email,
        fullName: payload.fullName,
      };
    } catch (error) {
      this.logger.error('Error validating super admin user', error);
      throw new UnauthorizedException();
    }
  }
}
