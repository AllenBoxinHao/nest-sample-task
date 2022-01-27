import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Request,
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
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const userRecord = await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return {
      user: {
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        email: userRecord.email,
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    // return req.user;
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  // @Post('auth/login')
  // async login(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ): Promise<any> {
  //   const userRecord = await this.usersService.findOne({ email });

  //   if (!userRecord) {
  //     return 'no user found';
  //     // throw new BadRequestException('Invalid Credentials');
  //   }
  //   if (!(await bcrypt.compare(password, userRecord.password))) {
  //     return 'wrong password';
  //     // throw new BadRequestException('Invalid Credentials');
  //   }

  //   const { pass, ...result } = userRecord;
  //   return result;
  // }

  @Get('public')
  getPublic(): string {
    return 'This is public access!';
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getPrivate(): string {
    return 'success!';
  }
}
