import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BaseService } from '../../common/base.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { UserService } from '../../modules/user/user.service';
import { type CreateRewardRecordDto } from './dtos/create-reward-record.dto';
import { FilterRewardRecordDto } from './dtos/filter-reward-record.dto';
import { RewardRecordDto } from './dtos/reward-record.dto';
import { type UpdateRewardRecordDto } from './dtos/update-reward-record.dto';
import { RewardRecordEntity } from './reward-record.entity';

// https://typeorm.io/repository-api
@Injectable()
export class RewardRecordService extends BaseService<RewardRecordEntity> {
  constructor(
    @InjectRepository(RewardRecordEntity)
    private rewardRecordRepository: Repository<RewardRecordEntity>,
    private userService: UserService,
    dataSource: DataSource,
  ) {
    super(rewardRecordRepository, dataSource);
  }

  // read - return multiple with pagination
  async paginateFindBy(
    filterData: FilterRewardRecordDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RewardRecordDto>> {
    let query = this.rewardRecordRepository.createQueryBuilder(
      this.getEntityName(),
    );

    for (const key in filterData) {
      if (Object.prototype.hasOwnProperty.call(filterData, key)) {
        const value = filterData[key];
        if (value !== undefined && value !== null) {
          query = query.andWhere(`${this.getEntityName()}.${key} = :${key}`, {
            [key]: value,
          });
        }
      }
    }

    const orderField =
      pageOptionsDto.q?.trim() || `${this.getEntityName()}.created_at`;

    const [items, pageMetaDto] = await query
      .orderBy(orderField, pageOptionsDto.order)
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  // create
  @Transactional()
  async create(
    createRewardRecordDto: CreateRewardRecordDto,
  ): Promise<RewardRecordEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      createRewardRecordDto.userId != undefined &&
      createRewardRecordDto.userId != null
    ) {
      if (
        !(await this.userService.existsBy({
          id: createRewardRecordDto.userId,
        }))
      ) {
        errors.push('user:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const user = await this.rewardRecordRepository.save(
        createRewardRecordDto,
      );
      return user;
    } else {
      throw new CustomErrorException(errors);
    }
  }

  // update
  @Transactional()
  async update(
    id: Uuid,
    updateRewardRecordDto: UpdateRewardRecordDto,
  ): Promise<UpdateResult> {
    const errors: Array<string> = [];

    // validation
    if (id != undefined) {
      if (!(await this.rewardRecordRepository.existsBy({ id: id }))) {
        errors.push('id:not_exist');
      }
    }

    if (
      updateRewardRecordDto.userId != undefined &&
      updateRewardRecordDto.userId != null
    ) {
      if (
        !(await this.userService.existsBy({
          id: updateRewardRecordDto.userId,
        }))
      ) {
        errors.push('user:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const res = await this.rewardRecordRepository.update(
        id,
        updateRewardRecordDto,
      );
      return res;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
