import {
  Controller,
  Body,
  Post,
  HttpCode,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { VError } from 'verror';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
  CreateSubscriptionDto,
  CreateSubscriptionSchema,
  DeleteSubscriptionDto,
  DeleteSubscriptionSchema,
} from './dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(CreateSubscriptionSchema))
  async create(
    @Body()
    { accountId, subscription, gateway }: CreateSubscriptionDto,
  ): Promise<void> {
    try {
      console.log(
        `Subscription create request for account: ${accountId}, endpoint: ${subscription.endpoint}, gateway: ${gateway} has been received.`,
      );
      await this.subscriptionsService.createSubscription(
        accountId,
        JSON.stringify(subscription),
        subscription.endpoint,
        gateway
      );
      console.log(
        `Subscription for account: ${accountId}, endpoint: ${subscription.endpoint} has been saved.`,
      );
    } catch (e: any) {
      console.error(
        `Subscription creation for account: ${accountId}, endpoint: ${subscription.endpoint} failed.`,
        e,
      );
      throw mapError(e);
    }
  }

  @Post('delete')
  @HttpCode(204)
  @UsePipes(new JoiValidationPipe(DeleteSubscriptionSchema))
  async delete(@Body() { endpoint }: DeleteSubscriptionDto): Promise<void> {
    try {
      console.log(
        `Subscription delete for endpoint: ${endpoint} has been received.`,
      );
      await this.subscriptionsService.deleteSubscription(endpoint);
    } catch (e: any) {
      console.error(
        `Subscription deletion for endpoint: ${endpoint} failed.`,
        e,
      );
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
