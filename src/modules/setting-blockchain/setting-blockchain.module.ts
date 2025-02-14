import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminSettingBlockchainController } from './setting-blockchain-admin.controller';
import { SettingBlockchainEntity } from './setting-blockchain.entity';
import { SettingBlockchainService } from './setting-blockchain.service';

@Module({
  imports: [TypeOrmModule.forFeature([SettingBlockchainEntity])],
  controllers: [AdminSettingBlockchainController],
  providers: [SettingBlockchainService],
  exports: [SettingBlockchainService],
})
export class SettingBlockchainModule {}
