import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Test } from 'src/database/models/test.schema';
import type { CreateTestDTO } from './dto/test.dto';
import { TestDbService } from 'src/database/services/test.db.service';
import { QuestionDbService } from 'src/database/services/question.db.service';
import { CommonConstants } from 'src/modules/common/constants/common.constants';
import { TestSessionDbService } from 'src/database/services/test.session.db.service';
import type { TestSession } from 'src/database/models/test.session.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  public constructor(
    private readonly testDbService: TestDbService,
    private readonly questionDbService: QuestionDbService,
    private readonly testSessionDbService: TestSessionDbService
  ) {}

  public async createTest(createTestDto: CreateTestDTO): Promise<Test> {
    try {
      // Fetch questions for the given questionIds
      const questions = await this.questionDbService.getQuestionsByIds(createTestDto.questionIds);

      // Extract difficulty levels from the questions
      const difficultyLevels = new Set(questions.map((q) => q.difficulty));

      // Check if all difficulty levels are present
      const allDifficultyLevels = new Set(CommonConstants.QUESTION_DIFFICULTIES); // Define all possible difficulty levels
      if (
        allDifficultyLevels.size !== difficultyLevels.size ||
        ![...allDifficultyLevels].every((level) => difficultyLevels.has(level))
      ) {
        throw new BadRequestException('Test must include questions from all difficulty levels');
      }
      const test = await this.testDbService.createTest({
        createTestDto,
        uniqueUrl: `${process.env.FRONTEND_BASE_URL}/tests/${uuidv4()}`,
      });
      return test;
    } catch (error) {
      this.logger.error(`Error creating test: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getTestById(id: string): Promise<Test & { testResults: TestSession[] }> {
    try {
      const test = await this.testDbService.getTestById(id);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      const testResults = await this.testSessionDbService.getTestSessionsByTestId(id);
      return { ...test, testResults };
    } catch (error) {
      this.logger.error(`Error fetching test details by id: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getTests(): Promise<Test[]> {
    try {
      const tests = await this.testDbService.getTests();
      return tests;
    } catch (error) {
      this.logger.error(`Error fetching tests: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
