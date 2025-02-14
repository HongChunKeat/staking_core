import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SettingBlockchainEntity } from '../../modules/setting-blockchain/setting-blockchain.entity';
import { UserStakeEntity } from '../../modules/user-stake/user-stake.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SettingStakeDto } from './dtos/setting-stake.dto';

// table name
@Entity({ name: 'setting_stake' })
@UseDto(SettingStakeDto)
export class SettingStakeEntity extends AbstractEntity<SettingStakeDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  contractAddress!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  signerAddress!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  privateKey!: string | null;

  @Column({ type: 'uuid' })
  blockchainId!: Uuid;

  @Column({ type: 'boolean' })
  isActive!: boolean | true;

  @Column({ type: 'bigint' })
  latestBlock!: number | 0;

  @ManyToOne(
    () => SettingBlockchainEntity,
    (settingBlockchainEntity) => settingBlockchainEntity.settingStakes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'blockchain_id' })
  settingBlockchain!: SettingBlockchainEntity;

  @OneToMany(
    () => UserStakeEntity,
    (userStakeEntity) => userStakeEntity.contract,
  )
  userStakes?: UserStakeEntity[];
}
