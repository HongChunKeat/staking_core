import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BaseService } from '../../common/base.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { opensslEncrypt } from '../../common/utils';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { SettingBlockchainService } from '../../modules/setting-blockchain/setting-blockchain.service';
import { type CreateSettingStakeDto } from './dtos/create-setting-stake.dto';
import { FilterSettingStakeDto } from './dtos/filter-setting-stake.dto';
import { SettingStakeDto } from './dtos/setting-stake.dto';
import { type UpdateSettingStakeDto } from './dtos/update-setting-stake.dto';
import { SettingStakeEntity } from './setting-stake.entity';

// https://typeorm.io/repository-api
@Injectable()
export class SettingStakeService extends BaseService<SettingStakeEntity> {
  constructor(
    @InjectRepository(SettingStakeEntity)
    private settingStakeRepository: Repository<SettingStakeEntity>,
    private settingBlockchainService: SettingBlockchainService,
    dataSource: DataSource,
  ) {
    super(settingStakeRepository, dataSource);
  }

  // read - return multiple with pagination
  async paginateFindBy(
    filterData: FilterSettingStakeDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<SettingStakeDto>> {
    let query = this.settingStakeRepository.createQueryBuilder(
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
    createSettingStakeDto: CreateSettingStakeDto,
  ): Promise<SettingStakeEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      createSettingStakeDto.name != undefined &&
      createSettingStakeDto.name != null
    ) {
      if (
        await this.settingStakeRepository.existsBy({
          name: createSettingStakeDto.name,
        })
      ) {
        errors.push('name:already_exist');
      }
    }

    if (
      createSettingStakeDto.blockchainId != undefined &&
      createSettingStakeDto.blockchainId != null
    ) {
      if (
        !(await this.settingBlockchainService.existsBy({
          id: createSettingStakeDto.blockchainId,
        }))
      ) {
        errors.push('blockchain:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      if (
        createSettingStakeDto.privateKey != undefined &&
        createSettingStakeDto.privateKey != null
      ) {
        createSettingStakeDto.privateKey = await opensslEncrypt(
          createSettingStakeDto.privateKey,
        );
      }

      const user = await this.settingStakeRepository.save(
        createSettingStakeDto,
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
    updateSettingStakeDto: UpdateSettingStakeDto,
  ): Promise<UpdateResult> {
    const errors: Array<string> = [];

    // validation
    if (id != undefined) {
      if (!(await this.settingStakeRepository.existsBy({ id: id }))) {
        errors.push('id:not_exist');
      }
    }

    if (
      updateSettingStakeDto.name != undefined &&
      updateSettingStakeDto.name != null
    ) {
      if (
        await this.settingStakeRepository.existsBy({
          name: updateSettingStakeDto.name,
          id: Not(id),
        })
      ) {
        errors.push('name:already_exist');
      }
    }

    if (
      updateSettingStakeDto.blockchainId != undefined &&
      updateSettingStakeDto.blockchainId != null
    ) {
      if (
        !(await this.settingBlockchainService.existsBy({
          id: updateSettingStakeDto.blockchainId,
        }))
      ) {
        errors.push('blockchain:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      if (
        updateSettingStakeDto.privateKey != undefined &&
        updateSettingStakeDto.privateKey != null
      ) {
        updateSettingStakeDto.privateKey = await opensslEncrypt(
          updateSettingStakeDto.privateKey,
        );
      }

      const res = await this.settingStakeRepository.update(
        id,
        updateSettingStakeDto,
      );
      return res;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
