import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SettingStakeEntity } from '../../modules/setting-stake/setting-stake.entity';
import { UserEntity } from '../user/user.entity';
import { UserStakeDto } from './dtos/user-stake.dto';

// table name
@Entity({ name: 'user_stake' })
@UseDto(UserStakeDto)
export class UserStakeEntity extends AbstractEntity<UserStakeDto> {
  @Column({ nullable: true, type: 'timestamp' })
  cutoffAt?: Date | null;

  @Column({ nullable: true, type: 'timestamp' })
  unstakeAt?: Date | null;

  @Column({ type: 'uuid' })
  userId!: Uuid;

  @Column({ type: 'uuid' })
  contractId!: Uuid;

  @Column({ nullable: true, type: 'varchar' })
  stakeTxid!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  unstakeTxid!: string | null;

  @Column({ type: 'decimal', precision: 30, scale: 8 })
  amount!: number | 0;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.stakes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(
    () => SettingStakeEntity,
    (settingStakeEntity) => settingStakeEntity.userStakes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'contract_id' })
  contract!: SettingStakeEntity;
}
