import { Length } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  DateFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { type UserStakeEntity } from '../user-stake.entity';

export class UserStakeDto extends AbstractDto {
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

  // must specify in here so will appear when used as output
  constructor(stakeEntity: UserStakeEntity) {
    super(stakeEntity);
    this.cutoffAt = stakeEntity.cutoffAt;
    this.unstakeAt = stakeEntity.unstakeAt;
    this.userId = stakeEntity.userId;
    this.contractId = stakeEntity.contractId;
    this.stakeTxid = stakeEntity.stakeTxid;
    this.unstakeTxid = stakeEntity.unstakeTxid;
    this.amount = stakeEntity.amount;
  }
}
