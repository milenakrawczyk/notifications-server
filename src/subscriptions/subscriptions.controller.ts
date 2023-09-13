import { Controller, Request, Body, Post, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

interface PushSubscriptionObject {
  endpoint: string
  expirationTime?: Number,
  keys: {
    p256dh: string,
    auth: string
  }
}

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  async create(
    @Body()
    { accountId, subscription }: { accountId: string; subscription: PushSubscriptionObject },
  ): Promise<void> {
    try {
      await this.subscriptionsService.createSubscription(
        accountId,
        JSON.stringify(subscription),
        subscription.endpoint
      );
      console.log(`Subscription for account ${accountId} has been saved.`);
    } catch (e: any) {
      console.error('Subscription creation failed.', e);
      // TODO map error
      throw e;
    }
  }

  @Post('delete')
  @HttpCode(204)
  async delete(
    @Body() { endpoint }: { endpoint: string },
  ): Promise<void> {
    try {
      await this.subscriptionsService.deleteSubscription(
        endpoint
      );
    } catch (e: any) {
      console.error('Subscription deletion failed.', e);
      // TODO map error
      throw e;
    }
  }
}
