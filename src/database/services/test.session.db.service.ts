import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Types } from 'mongoose';
import { Model } from 'mongoose';
import type { Test } from '../models/test.schema';
import { TestSession } from '../models/test.session.model';

@Injectable()
export class TestSessionDbService {
  public constructor(
    @InjectModel(TestSession.name)
    private testSessionModel: Model<TestSession>
  ) {}

  public async createTestSession({
    userId,
    testId,
    currentDifficulty,
  }: {
    userId: string;
    testId: string;
    currentDifficulty: number;
  }): Promise<TestSession> {
    return this.testSessionModel.create({
      testId,
      userId,
      currentDifficulty,
    });
  }

  public async getTestSessionsByUserAndTestId({
    testId,
    userId,
  }: {
    testId: string;
    userId: string;
  }): Promise<(TestSession & { _id: string; testId: Test }) | null> {
    return this.testSessionModel
      .findOne({ testId, userId })
      .populate('testId')
      .lean() as unknown as TestSession & { _id: string; testId: Test };
  }

  public async updateTestSession({
    testSessionId,
    answers,
    currentDifficulty,
    consecutiveCorrectAnswers,
    isTestCompleted,
  }: {
    testSessionId: string;
    answers?: {
      questionId: Types.ObjectId;
      isCorrect: boolean;
      difficulty: number;
    }[];
    currentDifficulty?: number;
    consecutiveCorrectAnswers?: number;
    isTestCompleted?: boolean;
  }): Promise<TestSession> {
    const testSession = await this.testSessionModel
      .findByIdAndUpdate(
        testSessionId,
        {
          ...(answers && { answers }),
          ...(currentDifficulty && { currentDifficulty }),
          ...(consecutiveCorrectAnswers && { consecutiveCorrectAnswers }),
          ...(isTestCompleted && { isTestCompleted }),
        },
        { new: true }
      )
      .lean();
    return testSession as TestSession;
  }

  public async getTestSessionsByTestId(testId: string): Promise<TestSession[]> {
    return this.testSessionModel
      .find({ testId, isTestCompleted: true })
      .populate({
        path: 'userId', // Populate User details
        select: 'fullName email', // You can specify the fields you want to populate (optional)
      })
      .populate({
        path: 'answers.questionId', // Populate Question details inside the answers array
      })
      .lean();
  }
}
