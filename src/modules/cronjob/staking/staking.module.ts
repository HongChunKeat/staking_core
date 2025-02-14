import { Module } from '@nestjs/common';

import { RewardRecordModule } from '../../reward-record/reward-record.module';
import { SettingBlockchainModule } from '../../setting-blockchain/setting-blockchain.module';
import { SettingStakeModule } from '../../setting-stake/setting-stake.module';
import { UserStakeModule } from '../../user-stake/user-stake.module';
import { UserModule } from '../../user/user.module';
import { StakingService } from './staking.service';

@Module({
  imports: [
    UserModule,
    UserStakeModule,
    RewardRecordModule,
    SettingBlockchainModule,
    SettingStakeModule,
  ],
  providers: [StakingService],
  exports: [StakingService],
})
export class StakingModule {}
