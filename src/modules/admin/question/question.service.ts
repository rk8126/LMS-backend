import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Question } from 'src/database/models/question.model';
import type { CreateQuestionDTO, UpdateQuestionDTO } from './dto/question.dto';
import { QuestionDbService } from 'src/database/services/question.db.service';

@Injectable()
export class QuestionService {
  private logger = new Logger(QuestionService.name);

  public constructor(private readonly questionDbService: QuestionDbService) {}

  public async createQuestion(createQuestionDto: CreateQuestionDTO): Promise<Question> {
    try {
      const newQuestion = await this.questionDbService.createQuestion(createQuestionDto);
      return newQuestion;
    } catch (error) {
      this.logger.error(`Error creating question: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getAllQuestions(): Promise<Question[]> {
    try {
      const questions = await this.questionDbService.getAllQuestions();
      return questions;
    } catch (error) {
      this.logger.error(`Error fetching questions: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getQuestionById(id: string): Promise<Question> {
    try {
      const question = await this.questionDbService.getQuestionById(id);
      if (!question) {
        throw new NotFoundException('Question not found');
      }
      return question;
    } catch (error) {
      this.logger.error(`Error fetching question details: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDTO): Promise<Question> {
    try {
      console.log('update is jere', updateQuestionDto);
      const updatedQuestion = await this.questionDbService.updateQuestion({
        questionId: id,
        questionDetails: updateQuestionDto,
      });
      if (!updatedQuestion) {
        throw new NotFoundException('Question not found');
      }
      return updatedQuestion;
    } catch (error) {
      this.logger.error(`Error updating question details: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async deleteQuestion(id: string): Promise<void> {
    try {
      const result = await this.questionDbService.deleteQuestion(id);
      if (!result) {
        throw new NotFoundException('Question not found');
      }
    } catch (error) {
      this.logger.error(`Error deleting question: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  // public async getTestById(testId: string): Promise<any> {
  //   return this.questionDbService.getTestById(testId);
  // }
}
