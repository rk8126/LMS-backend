import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from './models/admin.user.model';
import { QuestionSchema } from './models/question.model';
import { StudentSchema } from './models/student.model';
import { TestSchema } from './models/test.schema';
import { TestSessionSchema } from './models/test.session.model';
import { AdminDbService } from './services/admin.db.service';
import { StudentDbService } from './services/student.db.service';
import { QuestionDbService } from './services/question.db.service';
import { TestDbService } from './services/test.db.service';
import { TestSessionDbService } from './services/test.session.db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AdminUser', schema: AdminUserSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Test', schema: TestSchema },
      { name: 'TestSession', schema: TestSessionSchema },
    ]),
  ],
  providers: [
    AdminDbService,
    StudentDbService,
    QuestionDbService,
    TestDbService,
    TestSessionDbService,
  ],
  exports: [
    AdminDbService,
    StudentDbService,
    QuestionDbService,
    TestDbService,
    TestSessionDbService,
  ],
})
export class DatabaseModule {}
