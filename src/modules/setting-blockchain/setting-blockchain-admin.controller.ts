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
import { CreateSettingBlockchainDto } from './dtos/create-setting-blockchain.dto';
import { FilterSettingBlockchainDto } from './dtos/filter-setting-blockchain.dto';
import { SettingBlockchainDto } from './dtos/setting-blockchain.dto';
import { UpdateSettingBlockchainDto } from './dtos/update-setting-blockchain.dto';
import { SettingBlockchainService } from './setting-blockchain.service';

@Controller('admin/setting/blockchain')
@ApiTags('admin/setting/blockchain')
export class AdminSettingBlockchainController {
  constructor(private settingBlockchainService: SettingBlockchainService) {}

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SettingBlockchainDto })
  async read(@UUIDParam('id') id: Uuid): Promise<SettingBlockchainDto | null> {
    const result = await this.settingBlockchainService.findOneBy({ id: id });
    return result ?? null;
  }

  @Get('')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: SettingBlockchainDto })
  async paginate(
    @Query() filterSettingBlockchainDto: FilterSettingBlockchainDto,
    @Query() blockchainPageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<SettingBlockchainDto>> {
    return this.settingBlockchainService.paginateFindBy(
      filterSettingBlockchainDto,
      blockchainPageOptionsDto,
    );
  }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SettingBlockchainDto })
  async create(
    @Body() createSettingBlockchainDto: CreateSettingBlockchainDto,
  ): Promise<SettingBlockchainDto> {
    const result = await this.settingBlockchainService.create(
      createSettingBlockchainDto,
    );
    return result;
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateSettingBlockchainDto: UpdateSettingBlockchainDto,
  ): Promise<UpdateResult | void> {
    const result = await this.settingBlockchainService.update(
      id,
      updateSettingBlockchainDto,
    );
    return result;
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async delete(@UUIDParam('id') id: Uuid): Promise<DeleteResult | void> {
    const result = await this.settingBlockchainService.delete(id);
    return result;
  }
}
