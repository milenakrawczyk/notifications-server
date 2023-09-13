import { Subscription } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(
    account: Subscription['account'],
    pushSubscriptionObject: Subscription['pushSubscriptionObject'],
    endpoint: Subscription['endpoint'],
  ): Promise<void> {
    const subscriptionExists = await this.doesSubsciptionExist(
      endpoint
    );
    if (subscriptionExists) {
      console.log(`Deleting old subscription for account ${account}.`);
      await this.deleteSubscription(endpoint);
    }
    await this.prisma.subscription.create({
      data: {
        account,
        pushSubscriptionObject,
        endpoint
      },
      select: {
        id: true,
      },
    });
  }

  async deleteSubscription(
    endpoint: Subscription['endpoint']
  ): Promise<void> {
    const subscription = await this.getSubscription(
      endpoint
    );
    if (!subscription) {
      throw new Error('SUBSCRIPTION_NOT_PRESENT');
    }
    console.log(`Subscription for account ${subscription.account} has been deleted.`);

    await this.prisma.subscription.delete({
      where: {
        endpoint
      },
    });
  }

  private async doesSubsciptionExist(
    endpoint: Subscription['endpoint'],
  ): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        endpoint
      },
    });
    return subscription !== null;
  }

  private async getSubscription(
    endpoint: Subscription['endpoint'],
  ): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        endpoint
      },
    });
    return subscription;
  }
}


