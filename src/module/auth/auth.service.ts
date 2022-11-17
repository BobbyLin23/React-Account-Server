import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createToken(user: User): Promise<string> {
    return this.jwtService.sign({ username: user.username, sub: user.id });
  }

  async verifyToken(token: string) {
    if (!token) return null;

    return this.jwtService.verify(token.slice(7));
  }
}
