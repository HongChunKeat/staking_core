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
import { CreateUserDto } from './dtos/create-user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('admin/user/account')
@ApiTags('admin/user/account')
export class AdminUserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  async read(@UUIDParam('id') id: Uuid): Promise<UserDto | null> {
    const result = await this.userService.findOneBy({ id: id });
    return result ?? null;
  }

  @Get('')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: UserDto })
  async paginate(
    @Query() filterUserDto: FilterUserDto,
    @Query() userPageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.paginateFindBy(filterUserDto, userPageOptionsDto);
  }

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const result = await this.userService.create(createUserDto);
    return result;
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | void> {
    const result = await this.userService.update(id, updateUserDto);
    return result;
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async delete(@UUIDParam('id') id: Uuid): Promise<DeleteResult | void> {
    const result = await this.userService.delete(id);
    return result;
  }
}
