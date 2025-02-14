import { Matches } from 'class-validator';
import { StringField } from '../../../decorators';

export class UserVerifyDto {
  @StringField()
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  readonly web3Address!: string;

  @StringField()
  @Matches(/^0x[0-9a-fA-F]+$/)
  readonly sign!: string;
}