import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { HttpModule } from '@nestjs/axios';
import { MenuService } from './menu.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { DataModule } from '../data/data.module';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule, DataModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
