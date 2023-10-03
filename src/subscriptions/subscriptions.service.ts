import { Subscription } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VError } from 'verror';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(
    account: Subscription['account'],
    pushSubscriptionObject: Subscription['pushSubscriptionObject'],
    endpoint: Subscription['endpoint'],
    gateway: Subscription['gateway'],
  ): Promise<void> {
    const subscriptionExists = await this.doesSubsciptionExist(endpoint);
    if (subscriptionExists) {
      console.error(
        `Subscription for account: ${account}, endpoint: ${endpoint} already exists.`,
      );
      throw new VError(
        {
          info: {
            code: 'ALREADY_EXISTS',
            response: 'SUBSCRIPTION_ALREADY_EXISTS',
          },
        },
        `Subscription already exists for account: ${account}, endpoint: ${endpoint}, gateway: ${gateway}.`,
      );
    }
    try {
      await this.prisma.subscription.create({
        data: {
          account,
          pushSubscriptionObject,
          endpoint,
          gateway
        },
        select: {
          id: true,
        },
      });
    } catch (e: any) {
      console.error(
        `Failed while creating subscription for account: ${account}, endpoint: ${endpoint}.`,
      );
      throw new VError(e, `Failed while creating subscription for account: ${account}.`);
    }
  }

  async deleteSubscription(endpoint: Subscription['endpoint']): Promise<void> {
    const subscription = await this.getSubscription(endpoint);
    if (!subscription) {
      console.error(
        `Subscription for endpoint: ${endpoint} not found.`,
      );
      throw new VError(
        {
          info: {
            code: 'NOT_FOUND',
            response: 'SUBSCRIPTION_NOT_FOUND',
          },
        },
        `Subscription not found for endpoint: ${endpoint}.`,
      );
    }

    console.log(
      `Subscription for account ${subscription.account}, endpoint: ${endpoint} has been deleted.`,
    );

    try {
      await this.prisma.subscription.delete({
        where: {
          endpoint,
        },
      });
    } catch (e: any) {
      console.error(
        `Failed while deleting subscription for account: ${subscription.account}, endpoint: ${endpoint}.`,
      );
      throw new VError(e, `Failed while deleting subscription ${subscription.account}.`);
    }
  }

  private async doesSubsciptionExist(
    endpoint: Subscription['endpoint'],
  ): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(endpoint);
      return subscription !== null;
    } catch (e: any) {
      console.error(
        `Failed while executing subscription exists query for endpoint: ${endpoint}.`,
      );
      throw new VError(e, 'Failed while executing subscription exists query.');
    }
  }

  private async getSubscription(
    endpoint: Subscription['endpoint'],
  ): Promise<Subscription> {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          endpoint,
        },
      });
      return subscription;
    } catch (e: any) {
      console.error(
        `Failed while executing get subscription query for endpoint: ${endpoint}.`,
      );
      throw new VError(e, 'Failed while executing get subscription query.');
    }
  }
}
