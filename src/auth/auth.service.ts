import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    // if (!user) {
    //   return 'no user found';
    //   // throw new BadRequestException('Invalid Credentials');
    // }
    // if (!(await bcrypt.compare(password, user.password))) {
    //   return 'wrong password';
    //   // throw new BadRequestException('Invalid Credentials');
    // }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
