import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCommentDTO } from './dto/createCommentDTO';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async postComment(user_id: number, dto: createCommentDTO) {
    const { description, status_id, blog_id } = dto;
    try {
      if (!status_id && !blog_id) {
        throw new NotFoundException('Blog not found or Status not Found');
      }

      if (status_id && blog_id) {
        throw new NotFoundException(
          'You just can comment on Blog or Status one time',
        );
      }

      const newComment = await this.prisma.comment.create({
        data: {
          user_id: user_id,
          description: description,
          createdAt: new Date(),
          status_id: Number(status_id) || null,
          blog_id: Number(blog_id) || null,
        },
      });

      return {
        data: newComment,
        status: 201,
        message: 'success',
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
