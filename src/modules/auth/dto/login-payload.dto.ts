import { ClassField } from '../../../decorators';
import { UserDto } from '../../user/dtos/user.dto';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
  @ClassField(() => String)
  address: UserDto['web3Address'];

  @ClassField(() => String)
  nickname: UserDto['nickname'];

  @ClassField(() => String)
  role: UserDto['role'];

  @ClassField(() => TokenPayloadDto)
  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.address = user['web3Address'];
    this.nickname = user['nickname'];
    this.role = user['role'];
    this.token = token;
  }
}
