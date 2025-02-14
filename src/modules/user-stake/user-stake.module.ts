import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingStakeModule } from '../../modules/setting-stake/setting-stake.module';
import { UserModule } from '../../modules/user/user.module';
import { AdminUserStakeController } from './user-stake-admin.controller';
import { DappUserStakeController } from './user-stake-dapp.controller';
import { UserStakeEntity } from './user-stake.entity';
import { UserStakeService } from './user-stake.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStakeEntity]),
    UserModule,
    SettingStakeModule,
  ],
  controllers: [AdminUserStakeController, DappUserStakeController],
  providers: [UserStakeService],
  exports: [UserStakeService],
})
export class UserStakeModule {}
