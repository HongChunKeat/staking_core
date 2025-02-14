import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Address } from 'viem';
import { web3VerifyMessage } from '../../common/evm-logic';
import { RoleType, TokenType } from '../../constants';
import { CustomErrorException } from '../../exceptions/custom-errors.exception';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserVerifyDto } from './dto/user-verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(params: {
    userId: Uuid;
    role: RoleType;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: params.userId,
        type: TokenType.ACCESS_TOKEN,
        role: params.role,
      }),
    });
  }

  async validateUser(
    userVerifyDto: UserVerifyDto,
    message: any,
    role: RoleType,
  ): Promise<UserEntity | null> {
    const errors: Array<string> = [];

    // process data
    let user = await this.userService.findOneBy({
      web3Address: userVerifyDto.web3Address,
      role: role,
    });

    // validation
    if (
      !(await web3VerifyMessage(
        userVerifyDto.web3Address as Address,
        message,
        userVerifyDto.sign as Address,
      ))
    ) {
      errors.push('verification failed');
    }

    // proceed
    if (!errors.length) {
      // register
      if (!user && role == 'USER') {
        user = await this.userService.authCreate({
          web3Address: userVerifyDto['web3Address'],
          role: role,
        });
      }

      return user ?? null;
    } else {
      throw new CustomErrorException(errors);
    }
  }
}
