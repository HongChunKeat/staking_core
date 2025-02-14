import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BaseService } from '../../common/base.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { SettingStakeService } from '../../modules/setting-stake/setting-stake.service';
import { UserService } from '../../modules/user/user.service';
import { type CreateUserStakeDto } from './dtos/create-user-stake.dto';
import { FilterUserStakeDto } from './dtos/filter-user-stake.dto';
import { type UpdateUserStakeDto } from './dtos/update-user-stake.dto';
import { UserStakeDto } from './dtos/user-stake.dto';
import { UserStakeEntity } from './user-stake.entity';

// https://typeorm.io/repository-api
@Injectable()
export class UserStakeService extends BaseService<UserStakeEntity> {
  constructor(
    @InjectRepository(UserStakeEntity)
    private userStakeRepository: Repository<UserStakeEntity>,
    private userService: UserService,
    private settingStakeService: SettingStakeService,
    dataSource: DataSource,
  ) {
    super(userStakeRepository, dataSource);
  }

  // read - return multiple with pagination
  async paginateFindBy(
    filterData: FilterUserStakeDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserStakeDto>> {
    let query = this.userStakeRepository.createQueryBuilder(
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
    createUserStakeDto: CreateUserStakeDto,
  ): Promise<UserStakeEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      createUserStakeDto.userId != undefined &&
      createUserStakeDto.userId != null
    ) {
      if (
        !(await this.userService.existsBy({
          id: createUserStakeDto.userId,
        }))
      ) {
        errors.push('user:not_exist');
      }
    }

    if (
      createUserStakeDto.contractId != undefined &&
      createUserStakeDto.contractId != null
    ) {
      if (
        !(await this.settingStakeService.existsBy({
          id: createUserStakeDto.contractId,
        }))
      ) {
        errors.push('contract:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const user = await this.userStakeRepository.save(createUserStakeDto);
      return user;
    } else {
      throw new CustomErrorException(errors);
    }
  }

  // update
  @Transactional()
  async update(
    id: Uuid,
    updateUserStakeDto: UpdateUserStakeDto,
  ): Promise<UpdateResult> {
    const errors: Array<string> = [];

    // validation
    if (id != undefined) {
      if (!(await this.userStakeRepository.existsBy({ id: id }))) {
        errors.push('id:not_exist');
      }
    }

    if (
      updateUserStakeDto.userId != undefined &&
      updateUserStakeDto.userId != null
    ) {
      if (
        !(await this.userService.existsBy({
          id: updateUserStakeDto.userId,
        }))
      ) {
        errors.push('user:not_exist');
      }
    }

    if (
      updateUserStakeDto.contractId != undefined &&
      updateUserStakeDto.contractId != null
    ) {
      if (
        !(await this.settingStakeService.existsBy({
          id: updateUserStakeDto.contractId,
        }))
      ) {
        errors.push('contract:not_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const res = await this.userStakeRepository.update(id, updateUserStakeDto);
      return res;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
