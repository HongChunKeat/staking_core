import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../../modules/user/user.module';
import { AdminRewardRecordController } from './reward-record-admin.controller';
import { RewardRecordEntity } from './reward-record.entity';
import { RewardRecordService } from './reward-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardRecordEntity]), UserModule],
  controllers: [AdminRewardRecordController],
  providers: [RewardRecordService],
  exports: [RewardRecordService],
})
export class RewardRecordModule {}
