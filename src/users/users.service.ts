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

  async findOne(condition: any): Promise<any> {
    try {
      const result = await this.usersRepository.findOneOrFail(condition); // SELECT * from user WHERE;
      return result;
    } catch (err) {
      //handle error
      throw err;
    }
  }

  createUser(payload: User): Promise<User> {
    const newUser = { ...payload };

    return this.usersRepository.save(newUser); // INSERT
  }

  async updateUser(id: number, payload: User): Promise<User> {
    let user = await this.findOne(id);

    user = { ...user, ...payload };

    return this.usersRepository.save(user); // UPDATE
  }

  async deleteUser(id: number): Promise<User[]> {
    const user = await this.findOne(id);

    return this.usersRepository.remove(user);
  }
}
