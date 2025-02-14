import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NumberField, StringField } from '../../../decorators';
import { type SettingBlockchainEntity } from '../setting-blockchain.entity';

export class SettingBlockchainDto extends AbstractDto {
  @StringField({ nullable: true })
  name!: string | null;

  @StringField({ nullable: true })
  group!: string | null;

  @NumberField({ isPositive: true })
  chainId!: number | 0;

  @StringField({ nullable: true })
  rpcUrl!: string | null;

  // must specify in here so will appear when used as output
  constructor(settingBlockchainEntity: SettingBlockchainEntity) {
    super(settingBlockchainEntity);
    this.name = settingBlockchainEntity.name;
    this.group = settingBlockchainEntity.group;
    this.chainId = settingBlockchainEntity.chainId;
    this.rpcUrl = settingBlockchainEntity.rpcUrl;
  }
}
