import { Matches } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { BooleanField, NumberField, StringField } from '../../../decorators';
import { type SettingStakeEntity } from '../setting-stake.entity';

export class SettingStakeDto extends AbstractDto {
  @StringField({ nullable: true })
  name!: string | null;

  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  contractAddress!: string | null;

  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  signerAddress!: string | null;

  @StringField({ nullable: true })
  privateKey!: string | null;

  @StringField()
  blockchainId!: Uuid;

  @BooleanField()
  isActive!: boolean | false;

  @NumberField()
  latestBlock!: number | 0;

  // must specify in here so will appear when used as output
  constructor(settingStakeEntity: SettingStakeEntity) {
    super(settingStakeEntity);
    this.name = settingStakeEntity.name;
    this.contractAddress = settingStakeEntity.contractAddress;
    this.signerAddress = settingStakeEntity.signerAddress;
    this.privateKey = settingStakeEntity.privateKey;
    this.blockchainId = settingStakeEntity.blockchainId;
    this.isActive = settingStakeEntity.isActive;
    this.latestBlock = settingStakeEntity.latestBlock;
  }
}
