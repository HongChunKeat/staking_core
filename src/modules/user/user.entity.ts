import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants/role-type';
import { UseDto } from '../../decorators';
import { RewardRecordEntity } from '../reward-record/reward-record.entity';
import { UserStakeEntity } from '../user-stake/user-stake.entity';
import { UserDto } from './dtos/user.dto';

@Entity({ name: 'user' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true, type: 'varchar' })
  web3Address!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  nickname!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @OneToMany(() => UserStakeEntity, (userStakeEntity) => userStakeEntity.user)
  stakes?: UserStakeEntity[];

  @OneToMany(
    () => RewardRecordEntity,
    (rewardRecordEntity) => rewardRecordEntity.user,
  )
  rewards?: RewardRecordEntity[];
}
