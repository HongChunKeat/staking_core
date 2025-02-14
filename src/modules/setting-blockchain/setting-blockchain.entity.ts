import { Column, Entity, OneToMany } from 'typeorm';

import { SettingStakeEntity } from '../../modules/setting-stake/setting-stake.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SettingBlockchainDto } from './dtos/setting-blockchain.dto';

// table name
@Entity({ name: 'setting_blockchain' })
@UseDto(SettingBlockchainDto)
export class SettingBlockchainEntity extends AbstractEntity<SettingBlockchainDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  group!: string | null;

  @Column({ type: 'bigint' })
  chainId!: number | 0;

  @Column({ nullable: true, type: 'varchar' })
  rpcUrl!: string | null;

  @OneToMany(
    () => SettingStakeEntity,
    (settingStakeEntity) => settingStakeEntity.settingBlockchain,
  )
  settingStakes?: SettingStakeEntity[];
}
