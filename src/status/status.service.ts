import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import createStatusDTO from './dto/createStatusDTO';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import UpdateStatusDTO from './dto/updateStatusDTO';
import { UploadService } from 'src/upload/upload.service';
import { UploadType } from 'src/upload/dto/typeUploadDTO';

@Injectable()
export class StatusService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async createStatus(
    user_id: number,
    dto: createStatusDTO,
    file: Express.Multer.File,
  ) {
    const { text } = dto;
    try {
      const urlFile = file
        ? await this.uploadService.saveFile(file, UploadType.STATUS)
        : null;

      const newStatus = await this.prisma.status.create({
        data: {
          user_id: user_id,
          text: text,
          pic_of_status: urlFile,
          createdAt: new Date(),
        },
      });

      return {
        status: 201,
        data: newStatus,
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

  async getStatus(user_id: number) {
    try {
      const blogs = await this.prisma.status.findMany({
        where: {
          user_id: {
            not: user_id,
          },
        },
      });

      return {
        status: 200,
        data: blogs,
        success: true,
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

  async updateStatus(
    user_id: number,
    dto: UpdateStatusDTO,
    status_id: number,
    file: Express.Multer.File,
  ) {
    const { text } = dto;
    try {
      const status = await this.prisma.status.findUnique({
        where: {
          user_id: user_id,
          id: Number(status_id),
        },
      });

      if (!status) {
        throw new NotFoundException(
          'Blog not found or You not is created Blog',
        );
      }

      if (file && status.pic_of_status) {
        this.uploadService.deleteFile(status.pic_of_status, UploadType.STATUS);
      }

      const textData = text ? { text: text } : null;

      const urlFileData = file
        ? {
            pic_of_status: await this.uploadService.saveFile(
              file,
              UploadType.STATUS,
            ),
          }
        : null;

      const dataFilter = {
        ...urlFileData,
        ...textData,
      };

      const updatedStatus = await this.prisma.status.update({
        where: {
          id: Number(status_id),
        },
        data: dataFilter,
      });

      return {
        status: 200,
        data: updatedStatus,
        message: 'Success',
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

  async deleteStatus(user_id: number, status_id: number) {
    try {
      const status = await this.prisma.status.findUnique({
        where: {
          id: Number(status_id),
          user_id: user_id,
        },
      });

      if (!status) {
        throw new NotFoundException(
          'Blog not found or You not is created Blog',
        );
      }

      await this.prisma.status.update({
        where: {
          id: Number(status_id),
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        status: 200,
        message: 'Hide Status Successfully',
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
