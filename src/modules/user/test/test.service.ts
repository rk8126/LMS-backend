import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { AnswerOption, Question } from 'src/database/models/question.model';
import type { Test } from 'src/database/models/test.schema';
import type { TestSession } from 'src/database/models/test.session.model';
import { QuestionDbService } from 'src/database/services/question.db.service';
import { TestDbService } from 'src/database/services/test.db.service';
import { TestSessionDbService } from 'src/database/services/test.session.db.service';
import { CommonConstants } from 'src/modules/common/constants/common.constants';

@Injectable()
export class TestService {
  private logger = new Logger(TestService.name);

  public constructor(
    private readonly testSessionDbService: TestSessionDbService,
    private readonly questionDbService: QuestionDbService,
    private testDbService: TestDbService
  ) {}

  public async getTestByUniqueUrl(uniqueUrlId: string): Promise<Test> {
    try {
      const test = await this.testDbService.getTestByUniqueUrl({
        uniqueUrl: `${process.env.FRONTEND_BASE_URL}/tests/${uniqueUrlId}`,
      });
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      return test;
    } catch (error) {
      this.logger.error(`Error fetching test details by uniqueUrlId: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  public async startTest(testId: string, userId: string): Promise<Question | null> {
    try {
      const test = await this.testDbService.getTestById(testId);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      if (new Date() > test.deadline) {
        throw new BadRequestException('Test has been expired');
      }
      const testSession = await this.testSessionDbService.getTestSessionsByUserAndTestId({
        userId,
        testId,
      });
      if (testSession?.isTestCompleted) {
        throw new BadRequestException('Test has been completed');
      }
      if (testSession) {
        const question = await this.getNextQuestion({ testId, userId });
        return { ...question, correctAnswer: '' as AnswerOption } as Question;
      }
      const currentDifficulty = 5;
      const question = await this.questionDbService.getTestQuestionByQuestionIdsAndDifficulty({
        questionIds: test.questionIds.map((que) => que._id),
        currentDifficulty,
      });
      await this.testSessionDbService.createTestSession({
        testId: testId,
        userId,
        currentDifficulty,
      });
      return { ...question, correctAnswer: '' as AnswerOption } as Question;
    } catch (error) {
      this.logger.error(`Error starting test: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  // Update the test session with the user's answer
  public async submitAnswer({
    userId,
    testId,
    questionId,
    answer,
  }: {
    userId: string;
    testId: string;
    questionId: string;
    answer: AnswerOption;
  }): Promise<{ endTest: boolean }> {
    const question = await this.questionDbService.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const testSession = await this.testSessionDbService.getTestSessionsByUserAndTestId({
      userId,
      testId,
    });
    if (!testSession) {
      throw new NotFoundException('Test session not found');
    }
    if (testSession.isTestCompleted) {
      throw new BadRequestException('Test has been completed');
    }
    const isAlreadySubmitted = testSession.answers?.some(
      (ans) => String(ans.questionId) === String(questionId)
    );
    if (isAlreadySubmitted) {
      throw new BadRequestException('Question already submitted');
    }

    const answeredCorrectly = question.correctAnswer === answer;

    // Record the answer
    const answers = testSession.answers || [];
    answers.push({
      questionId: new Types.ObjectId(questionId),
      isCorrect: answeredCorrectly,
      difficulty: question.difficulty,
    });

    // Adjust difficulty based on the correctness of the answer
    const { currentDifficulty } = this.adjustDifficulty(testSession, answeredCorrectly);

    // Check if the test should end based on updated conditions
    const shouldEndTest =
      this.shouldEndUserTest({
        answers: testSession.answers,
        questionDifficulty: question.difficulty,
        answeredCorrectly,
      }) || testSession.answers?.length === testSession.testId?.questionIds?.length;

    // Update the test session in the database
    await this.testSessionDbService.updateTestSession({
      testSessionId: testSession._id,
      answers,
      currentDifficulty,
      ...(shouldEndTest && { isTestCompleted: shouldEndTest }),
    });

    // Return whether the test should end
    return { endTest: shouldEndTest };
  }

  // Adjust the difficulty for the next question
  private adjustDifficulty(
    testSession: TestSession,
    answeredCorrectly: boolean
  ): { currentDifficulty: number } {
    const { currentDifficulty } = testSession;

    let updatedDifficulty = testSession.currentDifficulty;
    if (answeredCorrectly) {
      // Increase difficulty if the answer was correct
      updatedDifficulty = Math.min(10, currentDifficulty + 1);
    } else {
      // Decrease difficulty if the answer was incorrect
      updatedDifficulty = Math.max(1, currentDifficulty - 1);
    }
    return {
      currentDifficulty: updatedDifficulty,
    };
  }

  // Check if the test should end based on conditions
  private shouldEndUserTest({
    answers,
    questionDifficulty,
    answeredCorrectly,
  }: {
    answers: {
      questionId: Types.ObjectId;
      isCorrect: boolean;
      difficulty: number;
    }[];
    questionDifficulty: number;
    answeredCorrectly: boolean;
  }): boolean {
    // Condition 1: User has attempted 20 questions
    if (answers.length >= 20) {
      return true;
    }

    // Condition 2: User has incorrectly answered a question of difficulty 1
    if (questionDifficulty === 1 && !answeredCorrectly) {
      return true;
    }

    const lastThreeAnswers = answers.slice(-3);
    // Condition 3: User has correctly answered 3 consecutive questions of difficulty 10
    if (lastThreeAnswers.length >= 3 && lastThreeAnswers.every((e) => e.difficulty === 10)) {
      return true;
    }

    return false;
  }

  // Start or continue a test session
  public async getNextQuestion({
    testId,
    userId,
  }: {
    testId: string;
    userId: string;
  }): Promise<Question | null> {
    try {
      // Fetch the test session for the given user and test
      const testSession = await this.testSessionDbService.getTestSessionsByUserAndTestId({
        userId,
        testId,
      });

      if (!testSession) {
        throw new NotFoundException('Test session not found');
      }

      if (testSession.isTestCompleted) {
        throw new BadRequestException('Test has been completed');
      }

      if (testSession.answers?.length >= testSession.testId?.questionIds?.length) {
        await this.testSessionDbService.updateTestSession({
          testSessionId: testSession._id,
          isTestCompleted: true,
        });
        throw new BadRequestException('Test has been completed');
      }

      // Exclude previously answered question IDs
      const excludeQuestionIds = testSession.answers?.map((answer) => String(answer.questionId));
      const questionIds = testSession.testId?.questionIds?.filter(
        (id) => !excludeQuestionIds.includes(String(id))
      );

      if (!questionIds?.length) {
        throw new NotFoundException('No more questions available');
      }

      const currentDifficulty = testSession.currentDifficulty;

      // Try to find the next question
      let nextQuestion = await this.questionDbService.getTestQuestionByQuestionIdsAndDifficulty({
        questionIds,
        currentDifficulty,
      });

      // If no question at the current difficulty, adjust difficulty and find a question
      if (!nextQuestion) {
        nextQuestion = await this.adjustDifficultyAndFindQuestion(
          testSession,
          questionIds,
          currentDifficulty
        );
      }

      if (!nextQuestion) {
        throw new NotFoundException('Question not found');
      }

      // Return the next question with an empty 'correctAnswer' field
      return { ...nextQuestion, correctAnswer: '' as AnswerOption };
    } catch (error) {
      // Log the error and rethrow it
      this.logger.error(`Error while getting next question: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private async adjustDifficultyAndFindQuestion(
    testSession: TestSession,
    questionIds: Types.ObjectId[],
    currentDifficulty: number
  ): Promise<Question | null> {
    // Fetch the last answer to determine if the previous answer was correct
    const isLastSubmittedAnswerCorrect = testSession?.answers.pop()?.isCorrect;
    const questions = await this.questionDbService.getQuestionsByIds(questionIds);

    let increaseDifficulty = currentDifficulty;
    let decreaseDifficulty = currentDifficulty;
    let foundQuestion = false;
    let nextQuestion: Question | null = null;

    // Loop to adjust difficulty and find the next question
    const allDifficultyLevels: { [key: number]: number } = {};
    CommonConstants.QUESTION_DIFFICULTIES.forEach(
      (difficulty) => (allDifficultyLevels[difficulty] = difficulty)
    );

    while (!foundQuestion) {
      if (isLastSubmittedAnswerCorrect) {
        // Gradually increase the difficulty to find a harder question
        increaseDifficulty++;
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const question = questions?.find((ques) => ques.difficulty === increaseDifficulty);
        if (question) {
          nextQuestion = question;
          foundQuestion = true;
          break;
        }
        delete allDifficultyLevels[increaseDifficulty];
      } else {
        // Gradually decrease the difficulty to find an easier question
        decreaseDifficulty--;
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const question = questions?.find((ques) => ques.difficulty === decreaseDifficulty);
        if (question) {
          nextQuestion = question;
          foundQuestion = true;
          break;
        }
        delete allDifficultyLevels[decreaseDifficulty];
      }

      // If neither increasing nor decreasing difficulty finds a question, break the loop
      if (increaseDifficulty > 10 || decreaseDifficulty < 1) {
        const finalDifficultyList = isLastSubmittedAnswerCorrect
          ? Object.values(allDifficultyLevels).sort((a, b) => b - a)
          : Object.values(allDifficultyLevels).sort((a, b) => a - b);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const question = questions?.find((ques) =>
          finalDifficultyList.some((d) => d === ques.difficulty)
        );
        if (question) {
          nextQuestion = question;
          foundQuestion = true;
          break;
        }
        break;
      }
    }

    return nextQuestion;
  }
}
