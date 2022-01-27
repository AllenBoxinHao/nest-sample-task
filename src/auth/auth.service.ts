import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      return 'no user found';
      // throw new BadRequestException('Invalid Credentials');
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      return 'wrong password';
      // throw new BadRequestException('Invalid Credentials');
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload);
    await this.usersService.updateUser(user.email, access_token, Date());

    return { access_token };
  }

  async logout(user: any) {
    await this.usersService.deleteUserJwt(user.email);

    return 'Logout Successfully';
  }
}
