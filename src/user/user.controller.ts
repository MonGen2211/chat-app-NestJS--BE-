import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDTO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }
}
