import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Student } from '../models/student.model';

@Injectable()
export class StudentDbService {
  public constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>
  ) {}

  // Create a new student (registration)
  public async createStudent({
    fullName,
    email,
    secret,
  }: {
    fullName: string;
    email: string;
    secret: string;
  }): Promise<Student & { _id: Types.ObjectId }> {
    const newStudent = await this.studentModel.create({ fullName, email, secret });
    return newStudent.toObject();
  }

  /**
   *  Fetch a student for a given email
   * @param email   Email of the student
   * @returns   Student object
   */
  public async findStudentByEmail(email: string): Promise<Student | null> {
    const result = await this.studentModel.findOne({ email }).lean();
    console.log({ resultIsHere: result });
    return result;
  }

  /**
   *  Fetch a Student for a given email
   * @param email   Email of the Student
   * @returns   Student object
   */
  public async findStudentById(id: string): Promise<Student | null> {
    const result = await this.studentModel.findById(id).lean();
    return result;
  }
}
