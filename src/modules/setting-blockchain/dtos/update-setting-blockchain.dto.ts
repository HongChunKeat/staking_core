import { NumberFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdateSettingBlockchainDto {
  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @StringFieldOptional({ nullable: true })
  group?: string | null;

  @NumberFieldOptional({ isPositive: true })
  chainId?: number | 0;

  @StringFieldOptional({ nullable: true })
  rpcUrl?: string | null;
}
