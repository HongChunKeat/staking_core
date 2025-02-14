import { NumberFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdateRewardRecordDto {
  @StringFieldOptional()
  userId?: Uuid;

  @NumberFieldOptional({ max: 99999999999999, isPositive: true })
  amount?: number | 0;
}
