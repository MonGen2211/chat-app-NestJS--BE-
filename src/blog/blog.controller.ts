import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import createBlog from './dto/createBlog';
import { AuthGuard } from 'src/user/auth.guard';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import getBlogDTO from './dto/getBlogDTO';
import updateBlogDTO from './dto/updateBlogDTO';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  createBlog(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: createBlog,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user_id = req.user.sub;
    return this.blogService.createBlog(user_id, dto, file);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  getBlog(
    @Req() req: Request & { user: { sub: number } },
    @Query('') dto: getBlogDTO,
  ) {
    const user_id = req.user.sub;
    return this.blogService.getBlog(user_id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getBlogId(@Param('id') id: number) {
    return this.blogService.getBlogWithID(id);
  }

  @UseGuards(AuthGuard)
  @Put('/delete/:blog_id')
  hideBlog(
    @Req() req: Request & { user: { sub: number } },
    @Param('blog_id') blog_id: number,
  ) {
    const user_id = req.user.sub;
    return this.blogService.hideBlog(user_id, blog_id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file')) // "file" đúng với tên trong Postman
  @Put('/:blog_id')
  updateBlog(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: updateBlogDTO,
    @UploadedFile() file: Express.Multer.File,
    @Param('blog_id') blog_id: number,
  ) {
    const user_id = req.user.sub;
    return this.blogService.updateBlog(user_id, dto, file, blog_id);
  }
}
