import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { HttpModule } from '@nestjs/axios';
import { MenuService } from './menu.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
