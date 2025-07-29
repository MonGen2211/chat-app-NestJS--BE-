import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { BlogModule } from './blog/blog.module';
import { UploadModule } from './upload/upload.module';
import { StatusModule } from './status/status.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // dùng được ở mọi nơi
    }),
    MessageModule,
    BlogModule,
    UploadModule,
    StatusModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
