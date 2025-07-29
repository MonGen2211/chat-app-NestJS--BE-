import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CommentController],
  imports: [ConfigModule, JwtModule.register({})],

  providers: [CommentService],
})
export class CommentModule {}
