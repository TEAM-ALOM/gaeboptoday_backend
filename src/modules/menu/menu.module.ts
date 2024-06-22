import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { HttpModule } from '@nestjs/axios';
import { MenuService } from './menu.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { DataModule } from '../data/data.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PrismaModule,
    DataModule,
    AuthModule,
    JwtModule.register({
      secret: '1234qwer',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
