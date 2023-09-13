import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  providers: [PrismaService, SubscriptionsService],
  controllers: [SubscriptionsController],
  imports: [PrismaService],
  exports: [],
})
export class SubscriptionsModule {}
