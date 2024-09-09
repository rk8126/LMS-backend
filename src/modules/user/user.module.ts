import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SecretManager } from 'src/utils/secret-manager.utils';
import { DatabaseModule } from 'src/database/database.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, SecretManager, JwtService],
})
export class UserModule {}
