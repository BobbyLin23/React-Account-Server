import { Controller, Param, Post } from '@nestjs/common';
import { RegisterInfoDto } from './user.dto';

@Controller()
export class UserController {
  @Post('/regitser')
  async register(@Param() dto: RegisterInfoDto) {
    if (!dto.username || !dto.password) {
      return;
    }
  }

  async login() {}
}
