import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { DBConfigModule } from './config/database/config.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AppConfigModule, DBConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
