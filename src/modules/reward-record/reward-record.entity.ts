import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { RewardRecordDto } from './dtos/reward-record.dto';

// table name
@Entity({ name: 'reward_record' })
@UseDto(RewardRecordDto)
export class RewardRecordEntity extends AbstractEntity<RewardRecordDto> {
  @Column({ type: 'uuid' })
  userId!: Uuid;

  @Column({ type: 'decimal', precision: 30, scale: 8 })
  amount!: number | 0;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.rewards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
