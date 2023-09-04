import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [SubscriptionsModule],
})
export class AppModule {}
