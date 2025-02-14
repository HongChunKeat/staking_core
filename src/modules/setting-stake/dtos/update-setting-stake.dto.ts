import { Matches } from 'class-validator';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

export class UpdateSettingStakeDto {
  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @StringFieldOptional({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  contractAddress?: string | null;

  @StringFieldOptional({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  signerAddress?: string | null;

  @StringFieldOptional({ nullable: true })
  privateKey?: string | null;

  @StringFieldOptional()
  blockchainId?: Uuid;

  @BooleanFieldOptional()
  isActive?: boolean | false;

  @NumberFieldOptional()
  latestBlock?: number | 0;
}
