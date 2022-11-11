import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/database/database.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
