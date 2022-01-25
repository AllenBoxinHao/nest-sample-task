import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req): any {
    return this.authService.login(req.user);
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
