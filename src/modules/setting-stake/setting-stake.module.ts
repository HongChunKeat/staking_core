import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingBlockchainModule } from '../../modules/setting-blockchain/setting-blockchain.module';
import { AdminSettingStakeController } from './setting-stake-admin.controller';
import { SettingStakeEntity } from './setting-stake.entity';
import { SettingStakeService } from './setting-stake.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingStakeEntity]),
    SettingBlockchainModule,
  ],
  controllers: [AdminSettingStakeController],
  providers: [SettingStakeService],
  exports: [SettingStakeService],
})
export class SettingStakeModule {}
