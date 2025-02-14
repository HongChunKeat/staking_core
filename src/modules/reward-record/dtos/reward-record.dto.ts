import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NumberField, StringField } from '../../../decorators';
import { type RewardRecordEntity } from '../reward-record.entity';

export class RewardRecordDto extends AbstractDto {
  @StringField()
  userId!: Uuid;

  @NumberField({ max: 99999999999999, isPositive: true })
  amount!: number | 0;

  // must specify in here so will appear when used as output
  constructor(rewardRecordEntity: RewardRecordEntity) {
    super(rewardRecordEntity);
    this.userId = rewardRecordEntity.userId;
    this.amount = rewardRecordEntity.amount;
  }
}
