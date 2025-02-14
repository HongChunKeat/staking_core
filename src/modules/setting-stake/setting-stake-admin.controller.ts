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
import { CreateSettingStakeDto } from './dtos/create-setting-stake.dto';
import { FilterSettingStakeDto } from './dtos/filter-setting-stake.dto';
import { SettingStakeDto } from './dtos/setting-stake.dto';
import { UpdateSettingStakeDto } from './dtos/update-setting-stake.dto';
import { SettingStakeService } from './setting-stake.service';

@Controller('admin/setting/stake')
@ApiTags('admin/setting/stake')
export class AdminSettingStakeController {
  constructor(private settingStakeService: SettingStakeService) {}

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SettingStakeDto })
  async read(@UUIDParam('id') id: Uuid): Promise<SettingStakeDto | null> {
    const result = await this.settingStakeService.findOneBy({ id: id });
    // if (result && result.privateKey) {
    //   result.privateKey = await opensslDecrypt(result.privateKey);
    // }
    return result ?? null;
  }

  @Get('')
  @Auth([RoleType.ADMIN])
  @ApiPageOkResponse({ type: SettingStakeDto })
  async paginate(
    @Query() filterSettingStakeDto: FilterSettingStakeDto,
    @Query() stakePageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<SettingStakeDto>> {
    return this.settingStakeService.paginateFindBy(
      filterSettingStakeDto,
      stakePageOptionsDto,
    );
  }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SettingStakeDto })
  async create(
    @Body() createSettingStakeDto: CreateSettingStakeDto,
  ): Promise<SettingStakeDto> {
    const result = await this.settingStakeService.create(createSettingStakeDto);
    return result;
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateSettingStakeDto: UpdateSettingStakeDto,
  ): Promise<UpdateResult | void> {
    const result = await this.settingStakeService.update(
      id,
      updateSettingStakeDto,
    );
    return result;
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async delete(@UUIDParam('id') id: Uuid): Promise<DeleteResult | void> {
    const result = await this.settingStakeService.delete(id);
    return result;
  }
}
