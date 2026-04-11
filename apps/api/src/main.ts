import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  // Force exactly port 4000 to prevent AWS AppRunner overriding with PORT=8080 automatically
  await app.listen(4000, "0.0.0.0");
}
bootstrap();
