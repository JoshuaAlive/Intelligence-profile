import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins (you can specify specific origins if needed)
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type'] // Allow specific headers
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  }));
  await app.listen(process.env.PORT ?? 8500);
}
bootstrap();
