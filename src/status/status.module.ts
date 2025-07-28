import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/user/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  controllers: [StatusController],
  imports: [ConfigModule, JwtModule.register({}), UploadModule],

  providers: [StatusService, AuthGuard],
})
export class StatusModule {}
