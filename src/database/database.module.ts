import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from './models/admin.user.model';
import { QuestionSchema } from './models/question.model';
import { UserSchema } from './models/user.model';
import { TestSchema } from './models/test.schema';
import { TestSessionSchema } from './models/test.session.model';
import { AdminDbService } from './services/admin.db.service';
import { UserDbService } from './services/user.db.service';
import { QuestionDbService } from './services/question.db.service';
import { TestDbService } from './services/test.db.service';
import { TestSessionDbService } from './services/test.session.db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AdminUser', schema: AdminUserSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Test', schema: TestSchema },
      { name: 'TestSession', schema: TestSessionSchema },
    ]),
  ],
  providers: [
    AdminDbService,
    UserDbService,
    QuestionDbService,
    TestDbService,
    TestSessionDbService,
  ],
  exports: [AdminDbService, UserDbService, QuestionDbService, TestDbService, TestSessionDbService],
})
export class DatabaseModule {}
