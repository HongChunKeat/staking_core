import { Matches } from 'class-validator';
import { BooleanField, NumberField, StringField } from '../../../decorators';

export class CreateSettingStakeDto {
  @StringField({ nullable: true })
  name!: string | null;

  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  contractAddress!: string | null;

  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  signerAddress!: string | null;

  @StringField({ nullable: true })
  privateKey!: string | null;

  @StringField()
  blockchainId!: Uuid;

  @BooleanField()
  isActive!: boolean | false;

  @NumberField()
  latestBlock!: number | 0;
}
