import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDTO';
import { loginUserDTO } from './dto/LoginUserDTO';
import { AuthGuard } from './auth.guard';
import { updateUserDTO } from './dto/updateUserDTO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-user')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('/login')
  login(@Body() dto: loginUserDTO) {
    return this.userService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Put('/')
  update(
    @Request() req: Request & { user: { sub: number } },
    @Body() dto: updateUserDTO,
  ) {
    const user = req.user;
    const userId = user.sub;
    return this.userService.updateProfile(userId, dto);
  }
}
