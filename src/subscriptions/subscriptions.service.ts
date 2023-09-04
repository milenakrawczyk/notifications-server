import { Subscription } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(
    account: Subscription['account'],
    pushSubscriptionObject: Subscription['pushSubscriptionObject'],
  ): Promise<void> {
    await this.prisma.subscription.create({
      data: {
        account,
        pushSubscriptionObject,
      },
      select: {
        id: true,
      },
    });
  }

  async deleteSubscription(account: string): Promise<void> {
    await this.prisma.subscription.updateMany({
      data: {
        active: false,
      },
      where: {
        account,
      },
    });
  }
}
