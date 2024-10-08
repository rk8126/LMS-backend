import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../models/test.schema';
import type { CreateTestDTO } from 'src/modules/admin/test/dto/test.dto';
import type { Question } from '../models/question.model';

@Injectable()
export class TestDbService {
  public constructor(
    @InjectModel(Test.name)
    private testModel: Model<Test>
  ) {}

  // Create a new test
  public async createTest({
    createTestDto,
    uniqueUrl,
  }: {
    createTestDto: CreateTestDTO;
    uniqueUrl: string;
  }): Promise<Test> {
    const test = await this.testModel.create({ ...createTestDto, uniqueURL: uniqueUrl });
    return test.toObject();
  }

  // Retrieve test details by unique URL
  public async getTestByUniqueUrl({ uniqueUrl }: { uniqueUrl: string }): Promise<Test | null> {
    return this.testModel.findOne({ uniqueURL: uniqueUrl }).lean();
  }

  // Retrieve test details by id
  public async getTestById(id: string): Promise<(Test & { questionIds: Question[] }) | null> {
    return this.testModel.findById(id).populate('questionIds').lean() as unknown as Test & {
      questionIds: Question[];
    };
  }

  // Retrieve all tests
  public async getTests(): Promise<Test[]> {
    return this.testModel.find().lean();
  }
}
