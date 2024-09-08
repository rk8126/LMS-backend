import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { SecretManager } from 'src/utils/secret-manager.utils';
import { DatabaseModule } from 'src/database/database.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [StudentController],
  providers: [StudentService, SecretManager, JwtService],
})
export class StudentModule {}
