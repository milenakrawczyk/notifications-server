import {
  Controller,
  Body,
  Post,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { VError } from 'verror';
import { SubscriptionsService } from './subscriptions.service';

interface PushSubscriptionObject {
  endpoint: string;
  expirationTime?: Number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  async create(
    @Body()
    {
      accountId,
      subscription,
    }: {
      accountId: string;
      subscription: PushSubscriptionObject;
    },
  ): Promise<void> {
    try {
      if (!accountId || !subscription) {
        //TODO validating request pipe
        throw new VError(
          {
            info: {
              code: 'BAD_REQUEST',
              response: 'BAD_CREATE_SUBSCRIPTION_REQUEST',
            },
          },
          'Bad create subscription request',
        );
      }
      await this.subscriptionsService.createSubscription(
        accountId,
        JSON.stringify(subscription),
        subscription.endpoint,
      );
      console.log(`Subscription for account ${accountId} has been saved.`);
    } catch (e: any) {
      console.error('Subscription creation failed.', e);
      throw mapError(e);
    }
  }

  @Post('delete')
  @HttpCode(204)
  async delete(@Body() { endpoint }: { endpoint: string }): Promise<void> {
    try {
      if (!endpoint) {
        //TODO validating request pipe
        throw new VError(
          {
            info: {
              code: 'BAD_REQUEST',
              response: 'BAD_DELETE_SUBSCRIPTION_REQUEST',
            },
          },
          'Bad delete subscription request',
        );
      }
      await this.subscriptionsService.deleteSubscription(endpoint);
    } catch (e: any) {
      console.error('Subscription deletion failed.', e);
      throw mapError(e);
    }
  }
}

function mapError(e: Error) {
  const errorInfo = VError.info(e);
  switch (errorInfo?.code) {
    case 'ALREADY_EXISTS':
    case 'NOT_FOUND':
      return new BadRequestException();
    case 'BAD_REQUEST':
      return new BadRequestException(errorInfo.response);
    default:
      return e;
  }
}
