import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BaseService } from '../../common/base.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { UserRegisterDto } from '../../modules/auth/dto/user-register.dto';
import { type CreateUserDto } from './dtos/create-user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';
import { type UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './user.entity';

// https://typeorm.io/repository-api
@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    dataSource: DataSource,
  ) {
    super(userRepository, dataSource);
  }

  // read - return multiple with pagination
  async paginateFindBy(
    filterData: FilterUserDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    let query = this.userRepository.createQueryBuilder(this.getEntityName());

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

  // auth create
  @Transactional()
  async authCreate(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      userRegisterDto.web3Address != undefined &&
      userRegisterDto.web3Address != null
    ) {
      if (
        await this.userRepository.existsBy({
          web3Address: userRegisterDto.web3Address,
          role: userRegisterDto.role,
        })
      ) {
        errors.push('web3Address:already_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const user = await this.userRepository.save(userRegisterDto);
      return user;
    } else {
      throw new CustomErrorException(errors);
    }
  }

  // create
  @Transactional()
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errors: Array<string> = [];

    // validation
    if (
      createUserDto.web3Address != undefined &&
      createUserDto.web3Address != null
    ) {
      if (
        await this.userRepository.existsBy({
          web3Address: createUserDto.web3Address,
          role: createUserDto.role,
        })
      ) {
        errors.push('web3Address:already_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const user = await this.userRepository.save(createUserDto);
      return user;
    } else {
      throw new CustomErrorException(errors);
    }
  }

  // update
  @Transactional()
  async update(id: Uuid, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const errors: Array<string> = [];

    // validation
    if (id != undefined) {
      if (!(await this.userRepository.existsBy({ id: id }))) {
        errors.push('id:not_exist');
      }
    }

    if (
      updateUserDto.web3Address != undefined &&
      updateUserDto.web3Address != null
    ) {
      if (
        await this.userRepository.existsBy({
          web3Address: updateUserDto.web3Address,
          role: updateUserDto.role,
          id: Not(id),
        })
      ) {
        errors.push('web3Address:already_exist');
      }
    }

    // proceed
    if (!errors.length) {
      const res = await this.userRepository.update(id, updateUserDto);
      return res;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
