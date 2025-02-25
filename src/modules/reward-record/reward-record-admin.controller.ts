import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DeleteResult, UpdateResult } from 'typeorm';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, UUIDParam } from '../../decorators';
import { CreateRewardRecordDto } from './dtos/create-reward-record.dto';
import { FilterRewardRecordDto } from './dtos/filter-reward-record.dto';
import { RewardRecordDto } from './dtos/reward-record.dto';
import { UpdateRewardRecordDto } from './dtos/update-reward-record.dto';
import { RewardRecordService } from './reward-record.service';

@Controller('admin/reward/record')
@ApiTags('admin/reward/record')
export class AdminRewardRecordController {
  constructor(private rewardRecordService: RewardRecordService) {}

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RewardRecordDto })
  async read(@UUIDParam('id') id: Uuid): Promise<RewardRecordDto | null> {
    const result = await this.rewardRecordService.findOneBy({ id: id });
    return result ?? null;
  }

  @Get('')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: RewardRecordDto })
  async paginate(
    @Query() filterRewardRecordDto: FilterRewardRecordDto,
    @Query() blockchainPageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RewardRecordDto>> {
    return this.rewardRecordService.paginateFindBy(
      filterRewardRecordDto,
      blockchainPageOptionsDto,
    );
  }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: RewardRecordDto })
  async create(
    @Body() createRewardRecordDto: CreateRewardRecordDto,
  ): Promise<RewardRecordDto> {
    const result = await this.rewardRecordService.create(createRewardRecordDto);
    return result;
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateRewardRecordDto: UpdateRewardRecordDto,
  ): Promise<UpdateResult | void> {
    const result = await this.rewardRecordService.update(
      id,
      updateRewardRecordDto,
    );
    return result;
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async delete(@UUIDParam('id') id: Uuid): Promise<DeleteResult | void> {
    const result = await this.rewardRecordService.delete(id);
    return result;
  }
}
