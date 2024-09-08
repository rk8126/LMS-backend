import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../models/test.schema';
import type { CreateTestDTO } from 'src/modules/admin/test/dto/test.dto';

@Injectable()
export class TestDbService {
  public constructor(
    @InjectModel(Test.name)
    private testModel: Model<Test>
  ) {}

  // Create a new test
  public async createTest(createTestDto: CreateTestDTO): Promise<Test> {
    console.log('test is here', createTestDto);
    const test = await this.testModel.create(createTestDto);
    return test.toObject();
  }

  // Retrieve test details by unique URL
  public async getTestByUniqueUrl(uniqueUrl: string): Promise<Test | null> {
    return this.testModel.findOne({ uniqueURL: uniqueUrl }).lean();
  }

  // Retrieve test details by id
  public async getTestById(id: string): Promise<Test | null> {
    return this.testModel.findById(id).lean();
  }
}
