import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import * as CryptoJS from 'crypto-js';
import MessageDTO from './dto/message.dto';
@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async getMessage(receiver_id: number, sender_id: number) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          receiverId: Number(receiver_id),
          senderId: sender_id,
        },
      });
      return {
        data: messages,
        status: 200,
        message: 'Get Message Successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }
      throw error;
    }
  }

  async sendMessage(receriver_id: number, sender_id: number, dto: MessageDTO) {
    const { text, picture } = dto;
    try {
      if (!text && !picture) {
        throw new BadRequestException('Message is empty');
      }
      const textData = text ? { text: this.hashMessage(text) } : null;
      const pictureData = picture
        ? { picture: this.hashMessage(picture) }
        : null;
      const dataFilter = {
        receiverId: Number(receriver_id),
        senderId: sender_id,
        ...textData,
        ...pictureData,
        createdAt: new Date(),
      };
      const newMessage = await this.prisma.message.create({
        data: dataFilter,
      });
      return {
        status: 201,
        data: newMessage,
        message: 'Send Message Successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }
      throw error;
    }
  }

  hashMessage(data: string) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('Missing SECRET_KEY in config');
    return CryptoJS.AES.encrypt(data, secret).toString();
  }

  async getAllUser(user_id: number) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            not: user_id,
          },
        },
      });

      return {
        status: 200,
        data: users,
        message: 'Get All User Successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }
      throw error;
    }
  }
}
