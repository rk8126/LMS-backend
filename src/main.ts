import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as express from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // if there is a startup failure, comment out the line below to see the error
    bufferLogs: true,
  });

  // Exception Handler
  app.use(express.json({ limit: '50mb' })); // Set limit to 50MB or as required
  app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: false,
    })
  );

  app.enableCors({
    origin: true, // Allow requests from any origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = 3000;
  EventEmitter.defaultMaxListeners = 20;

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.listen(PORT);
}

void bootstrap();
