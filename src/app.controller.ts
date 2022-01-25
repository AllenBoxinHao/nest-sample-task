import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './auth/local-auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('public')
  getPublic(@Request() req): string {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getPrivate(@Request() req): string {
    return req.user;
  }
}
