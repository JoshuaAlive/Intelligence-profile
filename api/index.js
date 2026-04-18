// api/index.js
const { NestFactory } = require('@nestjs/core');
let AppModule;

try {
  ({ AppModule } = require('../dist/app.module'));
} catch (error) {
  console.error(
    'Failed to load dist/app.module. Ensure build step runs before runtime.',
    error,
  );
}

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    if (!AppModule) {
      throw new Error(
        'AppModule is unavailable. Build artifact dist/app.module.js was not found.',
      );
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    await app.init();
    cachedServer = app;
  }
  return cachedServer;
}

module.exports = async (req, res) => {
  try {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp(req, res);
  } catch (error) {
    console.error('Serverless bootstrap failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Server bootstrap failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    );
  }
};
