import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { billProvider } from './user.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [BillController],
  providers: [BillService, ...billProvider],
})
export class BillModule {}
