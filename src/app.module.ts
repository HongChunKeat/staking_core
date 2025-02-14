import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { StakingModule } from './modules/cronjob/staking/staking.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { RewardRecordModule } from './modules/reward-record/reward-record.module';
import { SettingBlockchainModule } from './modules/setting-blockchain/setting-blockchain.module';
import { SettingStakeModule } from './modules/setting-stake/setting-stake.module';
import { UserStakeModule } from './modules/user-stake/user-stake.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        type: 'single',
        url:
          'redis://' +
          configService.redisConfig.host +
          ':' +
          configService.redisConfig.port,
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    HealthCheckerModule,
    AuthModule,
    UserModule,
    UserStakeModule,
    SettingBlockchainModule,
    SettingStakeModule,
    RewardRecordModule,
    StakingModule,
  ],
  providers: [],
})
export class AppModule {}
