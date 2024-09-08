import { IsNotEmpty, IsString, IsArray, IsDateString } from 'class-validator';
import type { Types } from 'mongoose';

export class CreateTestDTO {
  @IsNotEmpty()
  @IsString()
  public uniqueURL: string; // Unique URL to access the test

  @IsNotEmpty()
  @IsString()
  public title: string; // Test title or name

  @IsArray()
  @IsNotEmpty()
  public questionIds: Types.ObjectId[]; // Array of question IDs (ObjectId)

  @IsNotEmpty()
  @IsDateString()
  public deadline: Date; // Deadline for completing the test
}
