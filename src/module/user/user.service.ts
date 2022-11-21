import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createUserProps } from './interface';
import { User } from './user.entity';
import * as svgCaptcha from 'svg-captcha';

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

  async getImgCaptcha() {
    const svg = svgCaptcha.createMathExpr({
      size: 4,
      color: false,
      noise: 1,
      width: 100,
      height: 50,
    });
    return {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        `base64`,
      )}`,
      data: svg.text,
    };
  }
}
