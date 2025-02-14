import {
  DateFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators';

export class FilterRewardRecordDto {
  @UUIDFieldOptional()
  id?: Uuid;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  @StringFieldOptional()
  userId?: Uuid;

  @NumberFieldOptional({ max: 99999999999999, isPositive: true })
  amount?: number | 0;
}
