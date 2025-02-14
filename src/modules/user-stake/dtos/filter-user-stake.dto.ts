import { Length } from 'class-validator';
import {
  DateFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators';

export class FilterUserStakeDto {
  @UUIDFieldOptional()
  id?: Uuid;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  @DateFieldOptional({ nullable: true })
  cutoffAt?: Date | null;

  @DateFieldOptional({ nullable: true })
  unstakeAt?: Date | null;

  @StringFieldOptional()
  userId?: Uuid;

  @StringFieldOptional()
  contractId?: Uuid;

  @StringFieldOptional({ nullable: true })
  @Length(66)
  stakeTxid?: string | null;

  @StringFieldOptional({ nullable: true })
  @Length(66)
  unstakeTxid?: string | null;

  @NumberFieldOptional({ max: 99999999999999, isPositive: true })
  amount?: number | 0;
}
