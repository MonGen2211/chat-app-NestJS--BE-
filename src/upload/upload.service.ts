import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { UploadType } from './dto/typeUploadDTO';

@Injectable()
export class UploadService {
  /**
   * ✅ Hàm tạo thư mục theo loại nếu chưa có
   */
  private getUploadDir(type: UploadType): string {
    const dir = join(__dirname, '../../uploads', type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * ✅ Sửa hàm gốc: thêm tham số `type`, lưu ảnh theo loại
   */
  async saveFile(file: Express.Multer.File, type: UploadType): Promise<string> {
    const fileExt = extname(file.originalname);
    const filename = `${Date.now()}-${randomUUID()}${fileExt}`;
    const filePath = join(this.getUploadDir(type), filename);

    try {
      await fs.promises.writeFile(filePath, file.buffer);
      return filename; // Trả lại tên file để lưu DB hoặc tạo URL
    } catch (err) {
      console.error('❌ Upload file error:', err);
      throw new InternalServerErrorException('Could not save file');
    }
  }
  /**
   * ✅ Sửa hàm gốc: thêm `type`, xoá đúng ảnh theo loại
   */
  deleteFile(file: string, type: UploadType): void {
    const filePath = join(this.getUploadDir(type), file);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath); // Xoá file đồng bộ
        console.log(`File ${file} đã được xoá.`);
      } catch (err) {
        console.error(`Xoá file thất bại: ${err}`);
      }
    } else {
      console.warn(`File ${file} không tồn tại.`);
    }
  }
}
