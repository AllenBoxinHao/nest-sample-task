import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Get()
  // async getAll(): Promise<User[]> {
  //   return this.userService.getAll();
  // }

  @Get()
  async getOne(@Body() email: string): Promise<User> {
    return this.userService.findOne(email);
  }

  @Post()
  async createUser(@Body() body: User): Promise<User> {
    return this.userService.createUser(body);
  }

  // @Put('/:userId')
  // async updateUser(
  //   @Param('userId') userId: number,
  //   @Body() body: User,
  // ): Promise<User> {
  //   return this.userService.updateUser(userId, body);
  // }
}
