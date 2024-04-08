import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './modules/menu/menu.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [MenuModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
