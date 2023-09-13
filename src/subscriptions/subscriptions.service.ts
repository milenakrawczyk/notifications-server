import { Subscription } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(
    account: Subscription['account'],
    pushSubscriptionObject: Subscription['pushSubscriptionObject'],
    userAgent: Subscription['userAgent'],
  ): Promise<void> {
    const subscriptionExists = await this.doesSubsciptionExist(
      account,
      userAgent,
    );
    if (subscriptionExists) {
      console.log(`Deleting old subscription for account ${account}.`);
      await this.deleteSubscription(account, userAgent);
    }
    await this.prisma.subscription.create({
      data: {
        account,
        pushSubscriptionObject,
        userAgent,
      },
      select: {
        id: true,
      },
    });
  }

  async deleteSubscription(
    account: Subscription['account'],
    userAgent: Subscription['userAgent'],
  ): Promise<void> {
    const subscriptionExists = await this.doesSubsciptionExist(
      account,
      userAgent,
    );
    if (!subscriptionExists) {
      throw new Error('SUBSCRIPTION_NOT_PRESENT');
    }
    await this.prisma.subscription.delete({
      where: {
        subscriptionIdentifier: {
          account,
          userAgent,
        },
      },
    });
  }

  private async doesSubsciptionExist(
    account: Subscription['account'],
    userAgent: Subscription['userAgent'],
  ): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriptionIdentifier: {
          account,
          userAgent,
        },
      },
    });
    return subscription !== null;
  }
}
