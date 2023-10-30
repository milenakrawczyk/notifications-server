import {
  Controller,
  Body,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { VError } from 'verror';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { SetPreferenceDto, SetPreferenceSchema } from './dto';
import { PreferencesService } from './preferences.service';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('set')
  @UsePipes(new JoiValidationPipe(SetPreferenceSchema))
  async set(
    @Body()
    { accountId, endpoint, dapp, block }: SetPreferenceDto,
  ): Promise<void> {
    try {
      console.log(
        `Set preference request for account: ${accountId}, endpoint: ${endpoint}, dapp: ${dapp}, block: ${block} has been received.`,
      );
      await this.preferencesService.setPreference(accountId, endpoint, dapp, block);
      console.log(
        `Preference for account: ${accountId}, endpoint: ${endpoint}, dapp: ${dapp}, block: ${block} has been set.`,
      );
    } catch (e: any) {
      console.error(
        `Setting preference for account: ${accountId}, endpoint: ${endpoint}, dapp: ${dapp}, block: ${block} failed.`,
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
    case 'BAD_REQUEST':
      return new BadRequestException();
    default:
      return e;
  }
}
