import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { StudentJwtAuthGuard } from '../../auth/guards/student-jwt-auth.guard';
import type { Test } from 'src/database/models/test.schema';
import type { Question } from 'src/database/models/question.model';
import { CommonTypes } from 'src/types/common.types';
import { SubmitTestQuestionDTO } from './dto/test.dto';

@Controller('student/tests')
@UseGuards(StudentJwtAuthGuard)
export class TestController {
  public constructor(private readonly testService: TestService) {}

  @UseGuards(StudentJwtAuthGuard)
  @Get()
  public async getTestByUniqueUrl(
    @Query('uniqueURL') uniqueUrl: string
  ): Promise<{ message: string; data: Test }> {
    const data = await this.testService.getTestByUniqueUrl(uniqueUrl);
    return { message: 'Test retrieved successfully', data };
  }

  @Post('/:testId/start')
  public async startTest(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Question | null }> {
    const studentId = req.user._id;
    const question = await this.testService.startTest(testId, studentId);
    return { message: 'Test started successfully', data: question };
  }

  @Post(':testId/questions/:questionId/answer')
  public async submitAnswer(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() { answer }: SubmitTestQuestionDTO
  ): Promise<{ message: string; endTest: boolean }> {
    const studentId = req.user._id;
    const data = await this.testService.submitAnswer({ studentId, testId, questionId, answer });
    return { message: 'Answer submitted successfully', endTest: data.endTest };
  }

  @Get('next-question/:testId')
  public async getNextQuestion(
    @Req() req: CommonTypes.UserRequest,
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Question | null }> {
    const studentId = req.user._id;
    const question = await this.testService.getNextQuestion({ studentId, testId });
    return { message: 'Next Question fetched successfully', data: question };
  }
}
