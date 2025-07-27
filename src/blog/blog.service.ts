import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import createBlog from './dto/createBlog';
import { UploadService } from 'src/upload/upload.service';
import getBlogDTO from './dto/getBlogDTO';
import updateBlogDTO from './dto/updateBlogDTO';
@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async createBlog(
    user_id: number,
    dto: createBlog,
    file: Express.Multer.File,
  ) {
    const { header, description } = dto;
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { header: header },
      });

      if (blog) {
        throw new ConflictException('blog already exists');
      }

      const urlFile = await this.uploadService.saveFile(file);

      const newBlog = await this.prisma.blog.create({
        data: {
          user_id,
          header,
          description,
          createdAt: new Date(),
          pic_of_blog: urlFile,
        },
      });

      return {
        status: 201,
        message: 'Create Blog SuccessFully',
        data: newBlog,
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

  async getBlog(user_id: number, dto: getBlogDTO) {
    const { header, description, user_fullname } = dto;
    try {
      // header Filter
      const headerFilter = header
        ? {
            header: {
              contains: header,
              lte: 'insensitive',
            },
          }
        : null;

      // description Filter
      const descriptionFilter = description
        ? {
            description: {
              contains: description,
              lte: 'insensitive',
            },
          }
        : null;
      // fullname Author Filter
      const user_fullname_fillter = user_fullname
        ? { user: { fullname: user_fullname } }
        : {
            user_id: {
              not: user_id,
            },
          };

      const whereFilter = {
        ...headerFilter,
        ...descriptionFilter,
        ...user_fullname_fillter,
        deletedAt: null,
      };

      const blogs = await this.prisma.blog.findMany({
        where: whereFilter,
      });

      return {
        status: 200,
        data: blogs,
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

  async getBlogWithID(id: number) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          id: Number(id),
          deletedAt: null,
        },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      return {
        status: 200,
        data: blog,
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

  async updateBlog(
    user_id: number,
    dto: updateBlogDTO,
    file: Express.Multer.File,
    blog_id: number,
  ) {
    const { header, description } = dto;
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          id: Number(blog_id),
          user_id: user_id,
        },
      });

      if (!blog) {
        throw new NotFoundException(
          'Blog not found or You not is a created Blog',
        );
      }
      const headerFilter = header ? { header: header } : null;
      const descriptionFilter = description
        ? { description: description }
        : null;

      // delete file image in uploads
      if (blog.pic_of_blog && file) {
        this.uploadService.deleteFile(blog.pic_of_blog);
      }

      const urlFileFilter = file
        ? { pic_of_blog: await this.uploadService.saveFile(file) }
        : null;

      const data = {
        ...headerFilter,
        ...urlFileFilter,
        ...descriptionFilter,
        updatedAt: new Date(),
      };

      console.log(data);
      const updatedBlog = await this.prisma.blog.update({
        where: { id: Number(blog_id) },
        data: data,
      });

      return {
        status: 200,
        message: 'success',
        data: updatedBlog,
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

  async hideBlog(user_id: number, blog_id: number) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: {
          user_id: user_id,
          id: Number(blog_id),
        },
      });

      if (!blog) {
        throw new NotFoundException(
          'Blog not found or You not is a created Blog',
        );
      }

      await this.prisma.blog.update({
        where: { id: Number(blog_id) },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        status: 200,
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
