import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import createBlog from './dto/createBlog';
import { AuthGuard } from 'src/user/auth.guard';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private BlogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  createBlog(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: createBlog,
  ) {
    const user_id = req.user.sub;
    return this.BlogService.createBlog(user_id, dto);
  }
}
