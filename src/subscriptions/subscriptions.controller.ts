import { Controller, Request, Body, Post, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  async create(
    @Request() req,
    @Body()
    { accountId, subscription }: { accountId: string; subscription: object },
  ): Promise<void> {
    try {
      await this.subscriptionsService.createSubscription(
        accountId,
        JSON.stringify(subscription),
        req.headers['user-agent'],
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
    @Request() req,
    @Body() { accountId }: { accountId: string },
  ): Promise<void> {
    try {
      await this.subscriptionsService.deleteSubscription(
        accountId,
        req.headers['user-agent'],
      );
      console.log(`Subscription for account ${accountId} has been deleted.`);
    } catch (e: any) {
      console.error('Subscription deletion failed.', e);
      // TODO map error
      throw e;
    }
  }
}
