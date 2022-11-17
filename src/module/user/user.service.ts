import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createUserProps } from './interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async getUserByName(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async addUser(params: createUserProps): Promise<User> {
    let user = new User();
    user.username = params.username;
    user.password = params.password;
    user.avatar = params.avatar;
    user.signature = params.signature;
    return await this.userRepository.save(user);
  }

  async editUserInfo(username: string, signature: string) {
    let user = await this.getUserByName(username);
    user.signature = signature;
    return await this.userRepository.save(user);
  }
}
