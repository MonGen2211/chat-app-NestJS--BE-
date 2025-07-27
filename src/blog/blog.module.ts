import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthGuard } from 'src/user/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  controllers: [BlogController],
  imports: [ConfigModule, JwtModule.register({}), UploadModule],
  providers: [BlogService, AuthGuard],
})
export class BlogModule {}
