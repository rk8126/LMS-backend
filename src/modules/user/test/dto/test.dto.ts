import { IsEnum, IsNotEmpty } from 'class-validator';
import { AnswerOption } from 'src/database/models/question.model';

export class SubmitTestQuestionDTO {
  @IsNotEmpty()
  @IsEnum(AnswerOption)
  public answer: AnswerOption;
}
