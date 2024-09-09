import { connect, model } from 'mongoose';
import { faker } from '@faker-js/faker';
import type { Question, QuestionDocument } from '../models/question.model';
import { QuestionSchema } from '../models/question.model';

// Mongoose setup
async function connectToDatabase(): Promise<void> {
  try {
    await connect('<YOUR_MONGO_DB_URL>'); // Replace with your MongoDB URL
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

const QuestionModel = model<Question>('Question', QuestionSchema);

// Create random questions
async function createRandomQuestions(): Promise<void> {
  // Generate and insert 500 random questions
  for (let i = 0; i < 500; i++) {
    const randomQuestion = createRandomQuestion();
    await QuestionModel.create(randomQuestion); // Inserts the question into the database
  }
  console.log('500 questions seeded successfully');
}

function createRandomQuestion(): Question {
  const options = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    A: faker.lorem.words(5),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    B: faker.lorem.words(5),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    C: faker.lorem.words(5),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    D: faker.lorem.words(5),
  };

  const correctAnswerOptions = ['A', 'B', 'C', 'D'];
  const correctAnswer = correctAnswerOptions[Math.floor(Math.random() * 4)];

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    text: faker.lorem.sentence(),
    score: Math.floor(Math.random() * 10) + 1,
    difficulty: Math.floor(Math.random() * 10) + 1,
    options,
    correctAnswer,
    weight: Math.floor(Math.random() * 10) + 1, // Random weight between 0 and 10
  } as QuestionDocument;
}

// Main function to connect to DB and seed questions
async function main(): Promise<void> {
  await connectToDatabase();
  await createRandomQuestions();
  process.exit(); // Exit the process once seeding is done
}

void main();
