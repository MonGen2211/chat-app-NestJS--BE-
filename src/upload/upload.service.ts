// src/upload/upload.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(__dirname, '../../uploads');

  constructor() {
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    console.log(this.uploadDir);
    const fileExt = extname(file.originalname);
    const filename = `${Date.now()}-${randomUUID()}${fileExt}`;
    const filePath = join(this.uploadDir, filename);

    try {
      await fs.promises.writeFile(filePath, file.buffer);
      return filename; // Trả lại tên file để lưu DB hoặc tạo URL
    } catch (err) {
      console.error('❌ Upload file error:', err);
      throw new InternalServerErrorException('Could not save file');
    }
  }

  deleteFile(filename: string): void {
    const filePath = join(this.uploadDir, filename);

    // Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath); // Xoá file đồng bộ
        console.log(`File ${filename} đã được xoá.`);
      } catch (err) {
        console.error(`Xoá file thất bại: ${err}`);
      }
    } else {
      console.warn(`File ${filename} không tồn tại.`);
    }
  }
}
