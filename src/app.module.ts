import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/database/database.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { BillModule } from './module/bill/bill.module';
import { TypeModule } from './module/type/type.module';
import { UploadModule } from './module/Upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    BillModule,
    TypeModule,
    UploadModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
