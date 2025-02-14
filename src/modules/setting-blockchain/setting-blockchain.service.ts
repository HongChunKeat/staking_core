import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BaseService } from '../../common/base.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { type CreateSettingBlockchainDto } from './dtos/create-setting-blockchain.dto';
import { FilterSettingBlockchainDto } from './dtos/filter-setting-blockchain.dto';
import { SettingBlockchainDto } from './dtos/setting-blockchain.dto';
import { type UpdateSettingBlockchainDto } from './dtos/update-setting-blockchain.dto';
import { SettingBlockchainEntity } from './setting-blockchain.entity';

// https://typeorm.io/repository-api
@Injectable()
export class SettingBlockchainService extends BaseService<SettingBlockchainEntity> {
  constructor(
    @InjectRepository(SettingBlockchainEntity)
    private settingBlockchainRepository: Repository<SettingBlockchainEntity>,
    dataSource: DataSource,
  ) {
    super(settingBlockchainRepository, dataSource);
  }

  // read - return multiple with pagination
  async paginateFindBy(
    filterData: FilterSettingBlockchainDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<SettingBlockchainDto>> {
    let query = this.settingBlockchainRepository.createQueryBuilder(
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
    createSettingBlockchainDto: CreateSettingBlockchainDto,
  ): Promise<SettingBlockchainEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      createSettingBlockchainDto.name != undefined &&
      createSettingBlockchainDto.name != null
    ) {
      if (
        await this.settingBlockchainRepository.existsBy({
          name: createSettingBlockchainDto.name,
        })
      ) {
        errors.push('name:already_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const user = await this.settingBlockchainRepository.save(
        createSettingBlockchainDto,
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
    updateSettingBlockchainDto: UpdateSettingBlockchainDto,
  ): Promise<UpdateResult> {
    const errors: Array<string> = [];

    // validation
    if (id != undefined) {
      if (!(await this.settingBlockchainRepository.existsBy({ id: id }))) {
        errors.push('id:not_exist');
      }
    }

    if (
      updateSettingBlockchainDto.name != undefined &&
      updateSettingBlockchainDto.name != null
    ) {
      if (
        await this.settingBlockchainRepository.existsBy({
          name: updateSettingBlockchainDto.name,
          id: Not(id),
        })
      ) {
        errors.push('name:already_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const res = await this.settingBlockchainRepository.update(
        id,
        updateSettingBlockchainDto,
      );
      return res;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
