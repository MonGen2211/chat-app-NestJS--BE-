import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthGuard } from 'src/user/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  imports: [ConfigModule, JwtModule.register({})],
  providers: [BlogService, AuthGuard],
})
export class BlogModule {}
