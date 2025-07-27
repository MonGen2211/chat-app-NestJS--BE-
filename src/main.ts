import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser'; // ✅ Đúng
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true, // ⛔ Dừng lại khi gặp lỗi đầu tiên của từng field
    }),
  );
  // Cho phép truy cập file tĩnh trong thư mục uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // đường dẫn public
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
