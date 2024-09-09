import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Question } from '../models/question.model';
import type {
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from 'src/modules/admin/question/dto/question.dto';

@Injectable()
export class QuestionDbService {
  public constructor(
    @InjectModel(Question.name)
    private questionModel: Model<Question>
  ) {}

  public async createQuestion(createQuestionDTO: CreateQuestionDTO): Promise<Question> {
    const newQuestion = await this.questionModel.create(createQuestionDTO);
    return newQuestion.toObject();
  }

  public async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.find().sort({ createdAt: -1 }).lean();
  }

  public async getQuestionById(id: string): Promise<Question | null> {
    return this.questionModel.findById(id).lean();
  }

  public async updateQuestion({
    questionId,
    questionDetails,
  }: {
    questionId: string;
    questionDetails: UpdateQuestionDTO;
  }): Promise<Question | null> {
    const updateDetails = {
      ...(questionDetails.text && { text: questionDetails.text }),
      ...(questionDetails.score && { score: questionDetails.score }),
      ...(questionDetails.difficulty && { difficulty: questionDetails.difficulty }),
      ...(questionDetails.correctAnswer && { correctAnswer: questionDetails.correctAnswer }),
      ...(questionDetails.weight && { weight: questionDetails.weight }),
      ...(questionDetails.options && { options: questionDetails.options }),
    };
    return this.questionModel.findByIdAndUpdate(questionId, updateDetails, { new: true }).lean();
  }

  public async deleteQuestion(id: string): Promise<Question | null> {
    return this.questionModel.findByIdAndDelete(id);
  }

  public async getTestQuestionByQuestionIdsAndDifficulty({
    questionIds,
    currentDifficulty,
  }: {
    questionIds: Types.ObjectId[];
    currentDifficulty: number;
  }): Promise<Question | null> {
    const nextQuestion = await this.questionModel
      .findOne({
        _id: { $in: questionIds },
        difficulty: currentDifficulty,
      })
      .lean();
    return nextQuestion;
  }

  public async getNextTestQuestions({
    questionIds,
    difficulties,
  }: {
    questionIds: Types.ObjectId[];
    difficulties: number[];
  }): Promise<Question[]> {
    const nextQuestion = await this.questionModel
      .find({
        _id: { $in: questionIds },
        difficulty: { $in: difficulties },
      })
      .sort({ difficulty: 1 })
      .lean();
    return nextQuestion;
  }

  public async getQuestionsByIds(questionIds: Types.ObjectId[]): Promise<Question[]> {
    return this.questionModel
      .find({ _id: { $in: questionIds } })
      .sort({ difficulty: 1 })
      .lean();
  }
}
