import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthConstants } from '../common/constants/auth.constants';
import { UserJwtStrategy } from './strategy/user-jwt.strategy';
import { UserLocalStrategy } from './strategy/user.local.strategy';
import { AdminUserLocalStrategy } from './strategy/admin-user.local.strategy';
import { AdminJwtStrategy } from './strategy/admin-jwt.strategy';
import { SuperAdminJwtStrategy } from './strategy/super-admin-jwt.strategy';
import { SuperAdminUserLocalStrategy } from './strategy/super-admin-user.local.strategy';
import { PreLoginStrategy } from './strategy/pre-login.strategy';
import { SecretManager } from 'src/utils/secret-manager.utils';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: AuthConstants.JWT_TOKEN_EXPIRATION_TIME,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminUserLocalStrategy,
    AdminJwtStrategy,
    UserJwtStrategy,
    UserLocalStrategy,
    SuperAdminJwtStrategy,
    SuperAdminUserLocalStrategy,
    PreLoginStrategy,
    SecretManager,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
