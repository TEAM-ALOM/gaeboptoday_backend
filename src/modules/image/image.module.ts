import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
