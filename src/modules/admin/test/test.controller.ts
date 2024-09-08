import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import type { Test } from 'src/database/models/test.schema';
import { CreateTestDTO } from './dto/test.dto';
import { AdminJwtAuthGuard } from 'src/modules/auth/guards/admin-jwt-auth.guard';

@Controller('tests')
@UseGuards(AdminJwtAuthGuard)
export class TestController {
  public constructor(private readonly testService: TestService) {}

  @Post()
  public async createTest(
    @Body() createTestDTO: CreateTestDTO
  ): Promise<{ message: string; data: Test }> {
    const data = await this.testService.createTest(createTestDTO);
    return { message: 'Test retrieved successfully', data };
  }

  @Get('/:testId')
  public async getTestById(
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Test }> {
    const testDetails = await this.testService.getTestById(testId);
    return { message: 'Test Details retrieved successfully', data: testDetails };
  }

  // @Post(':testId/start')
  // public async startTest(
  //   @Param('testId') testId: string,
  //   @Body('userId') userId: string
  // ) {
  //   return this.testService.startTest(testId, userId);
  // }

  // @Post(':testId/questions/:questionId/answer')
  // public async submitAnswer(
  //   @Param('testId') testId: string,
  //   @Param('questionId') questionId: string,
  //   @Body('userId') userId: string,
  //   @Body() answerDto: AnswerQuestionDTO
  // ) {
  //   return this.testService.submitAnswer(testId, questionId, userId, answerDto);
  // }
}
