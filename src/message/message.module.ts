import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/user/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [MessageController],
  imports: [ConfigModule, JwtModule.register({})],
  providers: [MessageService, AuthGuard],
})
export class MessageModule {}
