import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { FilterUserStakeDto } from './dtos/filter-user-stake.dto';
import { UserStakeDto } from './dtos/user-stake.dto';
import { UserStakeService } from './user-stake.service';

@Controller('dapp/user/stake')
@ApiTags('dapp/user/stake')
export class DappUserStakeController {
  constructor(private stakeService: UserStakeService) {}

  @Get('')
  @Auth([RoleType.USER])
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
}
