import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { AnswerOption, Question } from 'src/database/models/question.model';
import type { Test } from 'src/database/models/test.schema';
import type { TestSession } from 'src/database/models/test.session.model';
import { QuestionDbService } from 'src/database/services/question.db.service';
import { TestDbService } from 'src/database/services/test.db.service';
import { TestSessionDbService } from 'src/database/services/test.session.db.service';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  public constructor(
    private readonly testSessionDbService: TestSessionDbService,
    private readonly questionDbService: QuestionDbService,
    private testDbService: TestDbService
  ) {}

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

  public async startTest(testId: string, studentId: string): Promise<Question | null> {
    try {
      const test = await this.testDbService.getTestById(testId);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      const currentDifficulty = 5;
      const question = await this.questionDbService.getNextTestQuestion({
        questionIds: test.questionIds,
        currentDifficulty,
      });
      await this.testSessionDbService.createTestSession({
        testId: testId,
        studentId,
        currentDifficulty,
      });
      return question;
    } catch (error) {
      this.logger.error(`Error starting test: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  // Update the test session with the user's answer
  public async submitAnswer({
    studentId,
    testId,
    questionId,
    answer,
  }: {
    studentId: string;
    testId: string;
    questionId: string;
    answer: AnswerOption;
  }): Promise<{ endTest: boolean }> {
    const question = await this.questionDbService.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const testSession = await this.testSessionDbService.getTestSessionsByStudentAndTestId({
      studentId,
      testId,
    });
    if (!testSession) {
      throw new NotFoundException('Test session not found');
    }

    const answeredCorrectly = question.correctAnswer === answer;

    // Record the answer
    testSession.answers.push({
      questionId: new Types.ObjectId(questionId),
      isCorrect: answeredCorrectly,
      difficulty: question.difficulty,
    });
    const answers = testSession.answers;
    const totalQuestionsAttempted = (testSession.totalQuestionsAttempted += 1);

    // Adjust difficulty based on the correctness of the answer
    const { currentDifficulty, consecutiveCorrectAnswers } = this.adjustDifficulty(
      testSession,
      answeredCorrectly
    );

    await this.testSessionDbService.updateTestSession({
      testSessionId: testSession._id,
      totalQuestionsAttempted,
      answers,
      currentDifficulty,
      consecutiveCorrectAnswers,
    });

    // End the test if conditions are met
    if (this.shouldEndTest(testSession)) {
      return { endTest: true };
    }
    return { endTest: false };
  }

  // Adjust the difficulty for the next question
  private adjustDifficulty(
    testSession: TestSession,
    answeredCorrectly: boolean
  ): { currentDifficulty: number; consecutiveCorrectAnswers: number } {
    const { currentDifficulty } = testSession;

    if (answeredCorrectly) {
      // Increase difficulty if the answer was correct
      testSession.currentDifficulty = Math.min(10, currentDifficulty + 1);

      // Track consecutive correct answers for difficulty 10
      if (currentDifficulty === 10) {
        testSession.consecutiveCorrectAnswers += 1;
      } else {
        testSession.consecutiveCorrectAnswers = 0;
      }
    } else {
      // Decrease difficulty if the answer was incorrect
      testSession.currentDifficulty = Math.max(1, currentDifficulty - 1);
      testSession.consecutiveCorrectAnswers = 0; // Reset streak
    }
    return {
      currentDifficulty: testSession.currentDifficulty,
      consecutiveCorrectAnswers: testSession.consecutiveCorrectAnswers,
    };
  }

  // Check if the test should end based on conditions
  private shouldEndTest(testSession: TestSession): boolean {
    const { totalQuestionsAttempted, currentDifficulty, consecutiveCorrectAnswers } = testSession;

    // Condition 1: User has attempted 20 questions
    if (totalQuestionsAttempted >= 20) {
      return true;
    }

    // Condition 2: User has incorrectly answered a question of difficulty 1
    if (currentDifficulty === 1 && testSession.answers.some((a) => !a.isCorrect)) {
      return true;
    }

    // Condition 3: User has correctly answered 3 consecutive questions of difficulty 10
    if (consecutiveCorrectAnswers >= 3) {
      return true;
    }

    return false;
  }

  // Start or continue a test session
  public async getNextQuestion({
    testId,
    studentId,
  }: {
    testId: string;
    studentId: string;
  }): Promise<Question | null> {
    try {
      const testSession = await this.testSessionDbService.getTestSessionsByStudentAndTestId({
        studentId,
        testId,
      });
      if (!testSession) {
        throw new NotFoundException('Test session not found');
      }
      const nextQuestion = await this.questionDbService.getNextTestQuestion({
        questionIds: testSession.testId?.questionIds || [],
        currentDifficulty: testSession.currentDifficulty,
      });

      return nextQuestion;
    } catch (error) {
      this.logger.error(`Error while getting next question: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
