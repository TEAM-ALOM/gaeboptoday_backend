import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/menu.module';
import { ConfigModule } from './modules/config/config.module';
import { DataModule } from './modules/data/data.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    MenuModule,
    ConfigModule,
    DataModule,
    UserModule,
    AuthModule,
    ReviewModule,
  ],
})
export class AppModule {}
