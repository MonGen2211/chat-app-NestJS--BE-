import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { CreateUserDto } from './dto/createUserDTO';

@Injectable()
export class UserService {
  signup(dto: CreateUserDto) {
    try {
      console.log(dto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw error;
    }
  }
}
