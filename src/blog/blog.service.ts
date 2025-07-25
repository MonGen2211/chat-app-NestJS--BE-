import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import createBlog from './dto/createBlog';
import cloudinary from './../common/cloudinary/cloudinary';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  // todo: do next
  async createBlog(user_id: number, dto: createBlog) {
    const { header, description, pic_of_blog } = dto;
    try {
      const [blog, newBlog, url_pic_of_blog] = await Promise.all([
        await this.prisma.blog.findUnique({
          where: { header: header },
        }),
        this.prisma.blog.create({
          data: {
            user_id,
            header,
            description,
            createdAt: new Date(),
          },
        }),
        cloudinary.uploader.upload(pic_of_blog),
      ]);

      if (blog) {
        throw new ConflictException('blog already exists');
      }

      const data = await this.prisma.blog.update({
        where: { id: newBlog.id },
        data: {
          pic_of_blog: url_pic_of_blog.secure_url,
        },
      });

      return {
        status: 201,
        message: 'Create Blog SuccessFully',
        data: data,
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
