import { Preference, Subscription } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VError } from 'verror';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AbstractDataTypeConstructor } from 'sequelize';

@Injectable()
export class PreferencesService {
  constructor(
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async setPreference(
    account: Preference['account'],
    endpoint: Preference['endpoint'],
    dapp: Preference['dapp'],
    block: Preference['block'],
  ): Promise<void> {
    const subscriptionExists =
      await this.subscriptionsService.doesSubsciptionExist(endpoint);
    if (!subscriptionExists) {
      console.error(
        `Subscription for account: ${account}, endpoint: ${endpoint} does not exist.`,
      );
      throw new VError(
        {
          info: {
            code: 'BAD_REQUEST',
            response: 'BAD_REQUEST',
          },
        },
        `Subscription does not exist for account: ${account}, endpoint: ${endpoint}.`,
      );
    }

    const subscription = await this.subscriptionsService.getSubscription(
      endpoint,
    );
    if (subscription.account !== account) {
      console.error(`Wrong account ${account} for endpoint: ${endpoint}.`);
      throw new VError(
        {
          info: {
            code: 'BAD_REQUEST',
            response: 'BAD_REQUEST',
          },
        },
        `Wrong account ${account} for endpoint: ${endpoint}.`,
      );
    }
    try {
      const preference = await this.getPreference(account, dapp);

      if (!preference) {
        await this.prisma.preference.create({
          data: {
            account,
            endpoint: subscription.endpoint,
            gateway: subscription.gateway,
            dapp,
            block,
          },
          select: {
            id: true,
          },
        });
      } else {
        await this.prisma.preference.update({
          data: {
            block,
          },
          where: {
            id: preference.id,
          },
        });
      }
    } catch (e: any) {
      console.error(
        `Failed while setting preference for account: ${account}, endpoint: ${endpoint}, dapp: ${dapp}, block: ${block}.`,
      );
      throw new VError(
        e,
        `Failed while setting preference for account: ${account}.`,
      );
    }
  }

  private async getPreference(
    account: Preference['account'],
    dapp: Preference['dapp'],
  ) {
    try {
      const preference = await this.prisma.preference.findFirst({
        where: {
          account,
          dapp,
        },
      });
      return preference;
    } catch (e: any) {
      console.error(
        `Failed while executing get preference query for account: ${account}, dapp: ${dapp}.`,
      );
      throw new VError(e, 'Failed while executing get preference query.');
    }
  }
}
