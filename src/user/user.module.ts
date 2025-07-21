import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import tokenService from 'src/token/token.service';
@Module({
  imports: [PrismaModule, ConfigModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, AuthGuard, tokenService],
  exports: [UserService, AuthGuard, tokenService],
})
export class UserModule {}
