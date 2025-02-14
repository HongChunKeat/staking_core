import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ILike } from 'typeorm';
import { createPublicClient, decodeEventLog, http } from 'viem';
import { recordReader } from '../../../common/evm-logic';
import { RoleType } from '../../../constants';
import { RewardRecordService } from '../../reward-record/reward-record.service';
import { SettingBlockchainService } from '../../setting-blockchain/setting-blockchain.service';
import { SettingStakeService } from '../../setting-stake/setting-stake.service';
import { UserStakeService } from '../../user-stake/user-stake.service';
import { UserService } from '../../user/user.service';
import StakingAbi from './staking.abi';

@Injectable()
export class StakingService {
  constructor(
    private userService: UserService,
    private userStakeService: UserStakeService,
    private rewardRecordService: RewardRecordService,
    private settingBlockchainService: SettingBlockchainService,
    private settingStakeService: SettingStakeService,
  ) {}

  @Cron('*/20 * * * * *')
  async handleCron() {
    const contracts = await this.settingStakeService.findBy({ isActive: true });

    for (let contract of contracts) {
      const network = await this.settingBlockchainService.findOneBy({
        id: contract.blockchainId,
      });

      if (
        network != undefined &&
        network != null &&
        network.rpcUrl != null &&
        contract.contractAddress != null
      ) {
        const publicClient = createPublicClient({
          transport: http(network.rpcUrl),
        });

        // get db latest block and blockchain latest block
        let startBlock = Number(contract.latestBlock);
        let endBlock = Number(await publicClient.getBlockNumber());

        // if empty start block then push it to front
        if (startBlock == null || startBlock == 0) {
          startBlock = endBlock - 100;
        }

        // cap it at max 30 block
        if (endBlock - startBlock > 30) {
          endBlock = startBlock + 30;
        }

        // only enter if startblock <= endblock and end block not 0
        if (startBlock <= endBlock && endBlock > 0) {
          const recordLists = await recordReader(
            publicClient,
            contract.contractAddress,
            startBlock,
            endBlock,
          );

          if (recordLists.res) {
            // Logger.debug(startBlock + '|' + endBlock);
            // Logger.debug(recordLists.data);

            for (const record of recordLists.data) {
              const decodedData = decodeEventLog({
                abi: StakingAbi,
                data: record.data,
                topics: record.meta.topics,
              });

              // Logger.debug(decodedData);

              if (decodedData != null) {
                const user = await this.userService.findOneBy({
                  web3Address: ILike(record.topic1.toLowerCase()),
                  role: RoleType.USER,
                });

                if (user != null) {
                  const date = new Date(
                    Number(decodedData.args.timestamp) * 1000,
                  );
                  const amount = Number(decodedData.args.amount) / 10 ** 6;

                  // stake
                  if (decodedData.eventName == 'TokenDeposit') {
                    // check stake txid exist
                    const checkExist = await this.userStakeService.findOneBy({
                      stakeTxid: record.txid,
                    });

                    // not exist then proceed
                    if (checkExist == null) {
                      await this.userStakeService.create({
                        cutoffAt: date,
                        userId: user.id,
                        contractId: contract.id,
                        stakeTxid: record.txid,
                        amount: amount,
                      });
                    }
                  }
                  // claim reward
                  else if (decodedData.eventName == 'TokenClaimReward') {
                    // direct update all cut off where unstake at is null
                    await this.userStakeService.updateWhereSet(
                      { userId: user.id, unstakeAt: null },
                      {
                        cutoffAt: date,
                      },
                    );

                    // record the reward amount
                    await this.rewardRecordService.create({
                      userId: user.id,
                      amount: amount,
                    });
                  }
                  // unstake
                  else if (decodedData.eventName == 'TokenUnstaked') {
                    // check unstake txid exist
                    const checkExist = await this.userStakeService.findOneBy({
                      unstakeTxid: record.txid,
                    });

                    // not exist then proceed
                    if (checkExist == null) {
                      // direct update all unstake at and set unstake txid where unstake at is null
                      await this.userStakeService.updateWhereSet(
                        { userId: user.id, unstakeAt: null },
                        {
                          unstakeAt: date,
                          unstakeTxid: record.txid,
                        },
                      );
                    }
                  }
                }
              }
            }

            // update latest block
            this.settingStakeService.update(contract.id, {
              latestBlock: endBlock,
            });
          }
        }
      }
    }
  }
}
