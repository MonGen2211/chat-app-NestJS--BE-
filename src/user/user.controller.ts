import { Body, Controller, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDTO';
import { loginUserDTO } from './dto/LoginUserDTO';
import { AuthGuard } from './auth.guard';
import { updateUserDTO } from './dto/updateUserDTO';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('/login')
  // , @Req() req: Request
  login(@Body() dto: loginUserDTO) {
    // const ua: string = (req.headers['user-agent'] as string) || '';
    return this.userService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Put('/')
  update(
    @Req() req: Request & { user: { sub: number } },
    @Body() dto: updateUserDTO,
  ) {
    const user = req.user;
    const userId = user.sub;
    return this.userService.updateProfile(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @Req() req: Request & { user: { sub: number } },
  ) {
    const user = req.user;
    const userId = user.sub;
    return this.userService.logout(userId);
  }
}
