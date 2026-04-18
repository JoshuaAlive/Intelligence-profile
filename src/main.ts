import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    await app.listen(process.env.PORT || 8500);
  }
  bootstrap();
}

// Export for Vercel serverless
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
};
