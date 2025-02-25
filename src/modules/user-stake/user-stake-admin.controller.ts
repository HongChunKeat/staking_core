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
import { CreateUserStakeDto } from './dtos/create-user-stake.dto';
import { FilterUserStakeDto } from './dtos/filter-user-stake.dto';
import { UpdateUserStakeDto } from './dtos/update-user-stake.dto';
import { UserStakeDto } from './dtos/user-stake.dto';
import { UserStakeService } from './user-stake.service';

@Controller('admin/user/stake')
@ApiTags('admin/user/stake')
export class AdminUserStakeController {
  constructor(private stakeService: UserStakeService) {}

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserStakeDto })
  async read(@UUIDParam('id') id: Uuid): Promise<UserStakeDto | null> {
    const result = await this.stakeService.findOneBy({ id: id });
    return result ?? null;
  }

  @Get('')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: UserStakeDto })
  async paginate(
    @Query() filterUserStakeDto: FilterUserStakeDto,
    @Query() stakePageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserStakeDto>> {
    return this.stakeService.paginateFindBy(
      filterUserStakeDto,
      stakePageOptionsDto,
    );
  }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserStakeDto })
  async create(
    @Body() createUserStakeDto: CreateUserStakeDto,
  ): Promise<UserStakeDto> {
    const result = await this.stakeService.create(createUserStakeDto);
    return result;
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateUserStakeDto: UpdateUserStakeDto,
  ): Promise<UpdateResult | void> {
    const result = await this.stakeService.update(id, updateUserStakeDto);
    return result;
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async delete(@UUIDParam('id') id: Uuid): Promise<DeleteResult | void> {
    const result = await this.stakeService.delete(id);
    return result;
  }
}
