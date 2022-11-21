import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(
    private authService: AuthService,
    private typeService: TypeService,
  ) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() request: Request, @Res() response: Response) {
    const token = request.headers.authorization;
    const decode = await this.authService.verifyToken(token);
    let user_id = decode.sub;
    const list = await this.typeService.getList(user_id);
    return response.send({
      code: 200,
      msg: 'success',
      data: {
        list,
      },
    });
  }
}
