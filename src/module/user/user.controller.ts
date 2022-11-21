import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginInfoDto, RegisterInfoDto } from './user.dto';
import { UserService } from './user.service';

const defaultAvatar =
  'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterInfoDto, @Res() response: Response) {
    if (!dto.username || !dto.password) {
      return response.send({
        code: 500,
        msg: 'username or password cannot be null',
        data: null,
      });
    }
    const userinfo = await this.userService.getUserByName(dto.username);
    if (userinfo && userinfo.id) {
      return response.send({
        code: 500,
        msg: 'Account has been registered, please input again',
        data: null,
      });
    }
    const res = await this.userService.addUser({
      username: dto.username,
      password: dto.password,
      avatar: defaultAvatar,
      signature: '',
    });
    if (res) {
      return response.send({
        code: 200,
        msg: 'Register Success',
        data: null,
      });
    } else {
      return response.send({
        code: 500,
        msg: 'Register Failed',
        data: null,
      });
    }
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() dto: LoginInfoDto, @Res() response: Response) {
    const user = await this.userService.getUserByName(dto.username);
    const token = await this.authService.createToken(user);
    return response.send({
      code: 200,
      msg: 'login success',
      data: { token },
    });
  }

  @Get('get_userinfo')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() request: Request, @Res() response: Response) {
    const token = request.headers.authorization;
    const result = await this.authService.verifyToken(token);
    const user = await this.userService.getUserByName(result.username);
    const userinfo = {
      username: user.username,
      id: user.id,
      signature: user.signature,
      avatar: user.avatar,
    };
    return response.send({
      code: 200,
      msg: 'Get Userinfo Success',
      data: { userinfo },
    });
  }

  @Post('edit_userinfo')
  @UseGuards(JwtAuthGuard)
  async editUserInfo(@Req() request: Request, @Res() response: Response) {
    const token = request.headers.authorization;
    const signature = request.body.signature;
    const user = await this.authService.verifyToken(token);
    const result = await this.userService.editUserInfo(
      user.username,
      signature,
    );
    return response.send({
      code: 200,
      msg: 'edit success',
      data: {
        id: result.id,
        signature,
        username: result.username,
      },
    });
  }

  @Get('captcha')
  async getCaptcha(@Res() response: Response) {
    const result = await this.userService.getImgCaptcha();
    return response.send({
      code: 200,
      data: result,
    });
  }
}
