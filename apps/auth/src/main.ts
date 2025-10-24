import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Required for Better Auth
    bodyParser: false,
    // Pino log
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
