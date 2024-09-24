import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: false,
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        '.env.local',
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
      validate,
    }),
  ],
})
export class ConfigModule {}
