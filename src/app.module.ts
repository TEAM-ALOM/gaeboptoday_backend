import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/menu.module';
import { ConfigModule } from './modules/config/config.module';
import { DataModule } from './modules/data/data.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [MenuModule, ConfigModule, DataModule, UserModule],
})
export class AppModule {}
