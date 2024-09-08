import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerOption } from 'src/database/models/question.model';

// DTO for the options object (A, B, C, D)
class OptionsDTO {
  @IsNotEmpty()
  @IsString()
  public A: string;

  @IsNotEmpty()
  @IsString()
  public B: string;

  @IsNotEmpty()
  @IsString()
  public C: string;

  @IsNotEmpty()
  @IsString()
  public D: string;
}

// Create DTO
export class CreateQuestionDTO {
  @IsNotEmpty()
  @IsString()
  public text: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  public score: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  public difficulty: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OptionsDTO)
  public options: OptionsDTO;

  @IsNotEmpty()
  @IsEnum(AnswerOption)
  public correctAnswer: AnswerOption;

  @IsInt()
  @Min(0)
  @Max(10)
  public weight = 0; // Default to 0
}

// Update DTO
export class UpdateQuestionDTO {
  @IsString()
  @IsOptional()
  public text?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  public score?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  public difficulty?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => OptionsDTO)
  public options?: OptionsDTO;

  @IsEnum(AnswerOption)
  @IsOptional()
  public correctAnswer?: AnswerOption;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public weight? = 0;
}
