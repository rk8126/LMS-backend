import type { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserIdMiddleware } from './middlewares/user.id.middleware';
import { AdminQuestionModule } from './modules/admin/question/question.module';
import { UserModule } from './modules/user/user.module';
import { AdminTestModule } from './modules/admin/test/test.module';
import { TestModule } from './modules/user/test/test.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loading environment variables globally
    MongooseModule.forRoot(process.env.MONGO_URI || ''), // Connecting to MongoDB using URI from env
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000, // zero downtime,
      errorLogStyle: 'pretty',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    AuthModule,
    DatabaseModule,
    AdminModule,
    AdminTestModule,
    AdminQuestionModule,
    UserModule,
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
