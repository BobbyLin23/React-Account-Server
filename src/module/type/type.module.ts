import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { TypeController } from './type.controller';
import { typeProvider } from './type.providers';
import { TypeService } from './type.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TypeController],
  providers: [TypeService, ...typeProvider],
})
export class TypeModule {}
