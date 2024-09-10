import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import type { Test } from 'src/database/models/test.schema';
import { CreateTestDTO } from './dto/test.dto';
import { AdminJwtAuthGuard } from 'src/modules/auth/guards/admin-jwt-auth.guard';

@Controller('admin/tests')
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

  @Get()
  public async getTests(): Promise<{ message: string; data: Test[] }> {
    const tests = await this.testService.getTests();
    return { message: 'Test Details retrieved successfully', data: tests };
  }

  @Get('/:testId')
  public async getTestById(
    @Param('testId') testId: string
  ): Promise<{ message: string; data: Test }> {
    const testDetails = await this.testService.getTestById(testId);
    return { message: 'Test Details retrieved successfully', data: testDetails };
  }
}
