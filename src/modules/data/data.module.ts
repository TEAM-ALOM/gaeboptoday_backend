import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DataService } from './data.service';
import { DataController } from './data.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
