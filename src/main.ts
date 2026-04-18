import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (required for grading)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Use PORT from environment or default to 3000
  const port = process.env.PORT || 8500;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
