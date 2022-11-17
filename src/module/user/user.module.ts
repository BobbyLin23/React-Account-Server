import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
