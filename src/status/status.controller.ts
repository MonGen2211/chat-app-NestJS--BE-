import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/user/auth.guard';
import createStatusDTO from './dto/createStatusDTO';
import UpdateStatusDTO from './dto/updateStatusDTO';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file')) // "file" đúng với tên trong Postman
  createStatus(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: createStatusDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user_id = req.user.sub;
    return this.statusService.createStatus(user_id, dto, file);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  getStatus(@Req() req: Request & { user: { sub: number } }) {
    const user_id = req.user.sub;
    return this.statusService.getStatus(user_id);
  }

  @UseGuards(AuthGuard)
  @Put('/delete/:status_id')
  DeleteStatus(
    @Req() req: Request & { user: { sub: number } },
    @Param('status_id') status_id: number,
  ) {
    const user_id = req.user.sub;
    return this.statusService.deleteStatus(user_id, status_id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file')) // "file" đúng với tên trong Postman
  @Put('/:status_id')
  updateStatus(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: UpdateStatusDTO,
    @Param('status_id') status_id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user_id = req.user.sub;
    return this.statusService.updateStatus(user_id, dto, status_id, file);
  }
}
