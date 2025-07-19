import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/user/auth.guard';
import MessageDTO from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('/getAllUser')
  getUser(@Request() req: Request & { user: { sub: number } }) {
    const user_id = req.user.sub;
    return this.messageService.getAllUser(user_id);
  }

  @UseGuards(AuthGuard)
  @Get('/:receiver_id')
  getMessage(
    @Param('receiver_id') receiver_id: number,
    @Request() req: Request & { user: { sub: number } },
  ) {
    const sender_id = req.user.sub;
    return this.messageService.getMessage(receiver_id, sender_id);
  }

  @UseGuards(AuthGuard)
  @Post('/:receiver_id')
  sendMessage(
    @Param('receiver_id') receiver_id: number,
    @Request() req: Request & { user: { sub: number } },
    @Body() dto: MessageDTO,
  ) {
    const sender_id = req.user.sub;
    return this.messageService.sendMessage(receiver_id, sender_id, dto);
  }
}
