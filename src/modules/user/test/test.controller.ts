import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { UserJwtAuthGuard } from '../../auth/guards/user-jwt-auth.guard';
import type { Test } from 'src/database/models/test.schema';
import type { Question } from 'src/database/models/question.model';
import { CommonTypes } from 'src/types/common.types';
import { SubmitTestQuestionDTO } from './dto/test.dto';

@Controller('user/tests')
export class TestController {
  public constructor(private readonly testService: TestService) {}

  @Get('/:uniqueUrlId')
  public async getTestByUniqueUrl(
    @Param('uniqueUrlId') uniqueUrlId: string
  ): Promise<{ message: string; data: Test }> {
    const data = await this.testService.getTestByUniqueUrl(uniqueUrlId);
    return { message: 'Test retrieved successfully', data };
  }

  @UseGuards(UserJwtAuthGuard)
  @Post('/:testId/start')
  public async startTest(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Question | null }> {
    const userId = req.user._id;
    const question = await this.testService.startTest(testId, userId);
    return { message: 'Test started successfully', data: question };
  }

  @UseGuards(UserJwtAuthGuard)
  @Post(':testId/questions/:questionId/answer')
  public async submitAnswer(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() { answer }: SubmitTestQuestionDTO
  ): Promise<{ message: string; endTest: boolean }> {
    const userId = req.user._id;
    const data = await this.testService.submitAnswer({ userId, testId, questionId, answer });
    return { message: 'Answer submitted successfully', endTest: data.endTest };
  }

  @UseGuards(UserJwtAuthGuard)
  @Get('next-question/:testId')
  public async getNextQuestion(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Question | null }> {
    const userId = req.user._id;
    const question = await this.testService.getNextQuestion({ userId, testId });
    return { message: 'Next Question fetched successfully', data: question };
  }
}
