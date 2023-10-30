import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

@Module({
  providers: [PrismaService, PreferencesService],
  controllers: [PreferencesController],
  imports: [PrismaService, SubscriptionsModule],
  exports: [],
})
export class PreferencesModule {}
