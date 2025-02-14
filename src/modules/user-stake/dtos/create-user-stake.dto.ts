import { Length } from 'class-validator';
import {
  DateFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class CreateUserStakeDto {
  @DateFieldOptional({ nullable: true })
  cutoffAt?: Date | null;

  @DateFieldOptional({ nullable: true })
  unstakeAt?: Date | null;

  @StringField()
  userId!: Uuid;

  @StringField()
  contractId!: Uuid;

  @StringFieldOptional({ nullable: true })
  @Length(66)
  stakeTxid?: string | null;

  @StringFieldOptional({ nullable: true })
  @Length(66)
  unstakeTxid?: string | null;

  @NumberField({ max: 99999999999999, isPositive: true })
  amount!: number | 0;
}
