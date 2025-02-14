import { NumberField, StringField } from '../../../decorators';

export class CreateSettingBlockchainDto {
  @StringField({ nullable: true })
  name!: string | null;

  @StringField({ nullable: true })
  group!: string | null;

  @NumberField({ isPositive: true })
  chainId!: number | 0;

  @StringField({ nullable: true })
  rpcUrl!: string | null;
}
