import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { web3SignMessage } from '../../common/evm-logic';
import { randomCode } from '../../common/utils';
import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserVerifyDto } from './dto/user-verify.dto';

import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';

@Controller('dapp/auth')
@ApiTags('dapp/auth')
export class DappAuthController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private authService: AuthService,
  ) {}

  /*
    status:
    description: 'Returns a signed message string',
    type:
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
    type: 'object',
    headers: {
      'X-Rate-Limit-Limit': { description: 'The maximum number of requests that the consumer is permitted to make per hour', type: 'integer' },
      'X-Rate-Limit-Remaining': { description: 'The number of requests remaining in the current rate limit window', type: 'integer' }
    }
  */
  @Get('ask/:web3Address')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'message',
    type: String,
  })
  async ask(@Query() userLoginDto: UserLoginDto) {
    const key = 'userAuthkey:' + userLoginDto['web3Address'];
    const message = 'sign message:' + randomCode();

    // 30 seconds
    await this.redis.setex(key, 30, message);

    // for testing purpose
    const signature = await web3SignMessage(message);
    console.log(`Signature: ${signature}`);

    return await this.redis.get(key);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
  })
  async verify(@Body() userVerifyDto: UserVerifyDto): Promise<LoginPayloadDto> {
    const errors: Array<string> = [];

    // process data
    const message = await this.redis.get(
      'userAuthkey:' + userVerifyDto.web3Address,
    );

    // validation
    if (message == null) {
      errors.push('verification failed');
    }

    // proceed
    if (!errors.length) {
      await this.redis.del('userAuthkey:' + userVerifyDto.web3Address);

      const userEntity = await this.authService.validateUser(
        userVerifyDto,
        message,
        RoleType.USER,
      );

      if (userEntity != null) {
        const token = await this.authService.createAccessToken({
          userId: userEntity.id,
          role: userEntity.role,
        });

        return new LoginPayloadDto(userEntity, token);
      } else {
        throw new CustomErrorException(['account not found']);
      }
    } else {
      throw new CustomErrorException(errors);
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOkResponse({
    description: 'current user info',
    schema: {
      type: 'object',
      properties: {
        web3address: { type: 'string' },
        nickname: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  getCurrentUser(@AuthUser() user: UserEntity) {
    return {
      web3address: user['web3Address'],
      nickname: user['nickname'],
      role: user['role'],
    };
  }
}
