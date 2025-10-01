import { Request } from 'express';
import { AuthGuard } from './../user/auth.guard';
import { CommentService } from './comment.service';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { createCommentDTO } from './dto/createCommentDTO';
import { updateCommentDTO } from './dto/updateCommentDTO';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('')
  createComment(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: createCommentDTO,
  ) {
    const user_id = req.user.sub;
    return this.commentService.postComment(user_id, dto);
  }


	@UseGuards(AuthGuard)
	@Put('/')
	updateComment(
		@Req() req: Request & { user: { sub: number } },
		@Body() dto: updateCommentDTO,
	) {
		const user_id = req.user.sub;
		return this.commentService.updateComment(user_id, dto);
	}
}
