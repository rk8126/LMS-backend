import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Test } from 'src/database/models/test.schema';
import type { CreateTestDTO } from './dto/test.dto';
import { TestDbService } from 'src/database/services/test.db.service';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  public constructor(private readonly testDbService: TestDbService) {}

  public async createTest(createTestDto: CreateTestDTO): Promise<Test> {
    try {
      const existingTest = await this.testDbService.getTestByUniqueUrl(createTestDto.uniqueURL);
      if (existingTest) {
        throw new BadRequestException('Test already exists with given url');
      }
      const test = await this.testDbService.createTest(createTestDto);
      return test;
    } catch (error) {
      this.logger.error(`Error creating test: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getTestById(id: string): Promise<Test> {
    try {
      const test = await this.testDbService.getTestById(id);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      return test;
    } catch (error) {
      this.logger.error(`Error fetching test details by id: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async getTestByUniqueUrl(uniqueUrl: string): Promise<Test> {
    try {
      const test = await this.testDbService.getTestByUniqueUrl(uniqueUrl);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      return test;
    } catch (error) {
      this.logger.error(`Error fetching test details by uniqueUrl: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
