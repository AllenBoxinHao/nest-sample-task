import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.find(); //SELECT * from user
  }

  async findOne(condition: any): Promise<any | undefined> {
    try {
      const result = await this.usersRepository.findOne(condition); // SELECT
      return result;
    } catch (err) {
      //handle error
      throw err;
    }
  }

  createUser(payload: User): Promise<User> {
    const newUser = { last_logged_in_at: Date(), ...payload };

    try {
      return this.usersRepository.save(newUser); // INSERT
    } catch (err) {
      throw err;
    }
  }

  async updateUser(email: string, access_token: string, login_time: string) {
    const updatedUser = {
      lastest_jwt: access_token,
      last_logged_in_at: login_time,
    };
    return this.usersRepository.update({ email }, updatedUser);
  }

  async deleteUserJwt(email: string) {
    const deletedJwt = {
      lastest_jwt: '0',
    };
    return this.usersRepository.update({ email }, deletedJwt);
  }
}
