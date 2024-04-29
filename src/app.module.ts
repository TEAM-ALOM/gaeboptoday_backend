import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './modules/menu/menu.module';
import { ConfigModule } from './modules/config/config.module';
import { DataModule } from './modules/data/data.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [MenuModule, ConfigModule, DataModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
