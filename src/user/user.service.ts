import cloudinary from './../common/cloudinary/cloudinary';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { CreateUserDto } from './dto/createUserDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginUserDTO } from './dto/LoginUserDTO';
import { updateUserDTO } from './dto/updateUserDTO';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}
  private readonly SALT_ROUNDS = 10;

  async signup(dto: CreateUserDto) {
    const { email, password, fullName, mobile } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        throw new BadRequestException('User has been created');
      }
      const hashPassword = await this.hashPassword(password);
      const newUser = await this.prisma.user.create({
        data: {
          fullname: fullName,
          email: email,
          mobile: mobile,
          password: hashPassword,
          createdAt: new Date(),
        },
      });
      const access_token = await this.signToken(newUser.id);
      const data = { ...newUser, access_token: access_token.access_token };

      return {
        status: 201,
        data: data,
        message: 'Create User SuccessFully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }

      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  checkPassword(password: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  async signToken(userId: number): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.configService.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: '7d',
    });

    return {
      access_token: token,
    };
  }

  async login(dto: loginUserDTO) {
    const { email, password } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const checkPassword = await this.checkPassword(password, user.password);

      if (!checkPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const access_token = await this.signToken(user.id);

      const data = {
        fullname: user.fullname,
        email: user.email,
        access_token: access_token.access_token,
      };

      return {
        status: 200,
        data: data,
        message: 'Login SuccessFully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }

      throw error;
    }
  }

  async updateProfile(userId: number, dto: updateUserDTO) {
    const { fullname, mobile, avatar } = dto;
    try {
      const fullnameData = fullname ? { fullname: fullname } : null;
      const mobileData = mobile ? { mobile: mobile } : null;

      const avatarUrl = avatar
        ? await cloudinary.uploader.upload(avatar)
        : null;

      const avatarData = avatarUrl?.secure_url
        ? { avatar: avatarUrl?.secure_url }
        : null;
      const data = {
        ...fullnameData,
        ...mobileData,
        ...avatarData,
        updatedAt: new Date(),
      };

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: data,
      });

      return {
        status: 200,
        data: updatedUser,
        message: 'Update user Successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P202') {
          throw new ConflictException();
        }
      }

      throw error;
    }
  }
}
