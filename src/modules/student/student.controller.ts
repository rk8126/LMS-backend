import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { StudentService } from './student.service';
import { RegisterDTO } from './dto/student.dto';
import type { Student } from 'src/database/models/student.model';

@Controller('students')
export class StudentController {
  public constructor(private readonly studentService: StudentService) {}

  @Post('/register')
  @HttpCode(201)
  public async createStudent(
    @Body() registerDTO: RegisterDTO
  ): Promise<{ message: string; data: { accessToken: string; student: Student } }> {
    const student = await this.studentService.register(registerDTO);
    return { message: 'Student registered successfully', data: student };
  }
}
