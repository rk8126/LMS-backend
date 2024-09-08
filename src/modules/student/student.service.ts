import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Student } from 'src/database/models/student.model';
import type { RegisterDTO } from './dto/student.dto';
import type { CommonTypes } from 'src/types/common.types';
import { SecretManager } from 'src/utils/secret-manager.utils';
import { StudentDbService } from 'src/database/services/student.db.service';

@Injectable()
export class StudentService {
  private logger = new Logger(StudentService.name);

  public constructor(
    private readonly studentDbService: StudentDbService,
    private readonly jwtService: JwtService,
    private readonly secretManager: SecretManager
  ) {}

  public async register(
    registerDto: RegisterDTO
  ): Promise<{ accessToken: string; student: Student }> {
    try {
      const existingStudent = await this.studentDbService.findStudentByEmail(registerDto.email);
      if (existingStudent) {
        throw new BadRequestException('Student already exists with email');
      }
      const { secretHash } = await this.secretManager.generateHashFromString(registerDto.secret);
      const student = await this.studentDbService.createStudent({
        fullName: registerDto.fullName,
        email: registerDto.email,
        secret: secretHash,
      });
      const payload: CommonTypes.ValidationPayload = {
        _id: String(student._id),
        email: student.email,
        fullName: student.fullName,
      };
      // console.log('payload is here', payload, this.jwtService.sign(payload));
      return {
        accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        student: { ...student, secret: '' },
      };
    } catch (error) {
      this.logger.error(`Error creating student: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
