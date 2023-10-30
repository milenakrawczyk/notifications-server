import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreferencesModule } from './preferences/preferences.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [SubscriptionsModule, PreferencesModule],
})
export class AppModule {}
