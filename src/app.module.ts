import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/database/database.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { BillModule } from './module/bill/bill.module';

@Module({
  imports: [UserModule, DatabaseModule, AuthModule, BillModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
