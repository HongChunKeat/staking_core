import { NumberField, StringField } from '../../../decorators';

export class CreateRewardRecordDto {
  @StringField()
  userId!: Uuid;

  @NumberField({ max: 99999999999999, isPositive: true })
  amount!: number | 0;
}
