import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AdminJwtAuthGuard } from '../../auth/guards/admin-jwt-auth.guard';
import { CreateQuestionDTO, UpdateQuestionDTO } from './dto/question.dto';
import type { Question } from 'src/database/models/question.model';

@Controller('admin/questions')
@UseGuards(AdminJwtAuthGuard) // Guard for Admin only access
export class QuestionController {
  public constructor(private readonly questionService: QuestionService) {}

  @Post()
  public async createQuestion(
    @Body() createQuestionDto: CreateQuestionDTO
  ): Promise<{ message: string; data: Question }> {
    const newQuestion = await this.questionService.createQuestion(createQuestionDto);
    return { message: 'Question created successfully', data: newQuestion };
  }

  @Get()
  public async getAllQuestions(): Promise<{ message: string; data: Question[] }> {
    const questions = await this.questionService.getAllQuestions();
    return { message: 'Questions retrieved successfully', data: questions };
  }

  @Get('/:id')
  public async getQuestionById(
    @Param('id') id: string
  ): Promise<{ message: string; data: Question }> {
    const question = await this.questionService.getQuestionById(id);
    return { message: 'question details fetched successfully', data: question };
  }

  @Put('/:id')
  public async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDTO
  ): Promise<{ message: string; data: Question }> {
    const question = await this.questionService.updateQuestion(id, updateQuestionDto);
    return { message: 'Question updated successfully', data: question };
  }

  @Delete('/:id')
  public async deleteQuestion(@Param('id') id: string): Promise<{ message: string }> {
    await this.questionService.deleteQuestion(id);
    return { message: 'Question deleted successfully' };
  }
}
