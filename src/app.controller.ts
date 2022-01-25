import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.usersService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    if (await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req): Promise<any> {
  //   return this.authService.login(req.user);
  // }

  // @Get('public')
  // getPublic(@Request() req): string {
  //   return req.user;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('protected')
  // getPrivate(@Request() req): string {
  //   return req.user;
  // }
}
