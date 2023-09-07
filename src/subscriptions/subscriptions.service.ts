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
    const subscriptionExists = await this.doesSubsciptionExist(account);
    if (subscriptionExists) {
      console.log(`Deleting old subscription for account ${account}.`);
      await this.deleteSubscription(account);
    }
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
    const subscriptionExists = await this.doesSubsciptionExist(account);
    if (!subscriptionExists) {
      throw new Error('SUBSCRIPTION_NOT_PRESENT');
    }
    await this.prisma.subscription.delete({
      where: {
        account,
      },
    });
  }

  private async doesSubsciptionExist(account: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        account,
      },
    });
    return subscription !== null;
  }
}
