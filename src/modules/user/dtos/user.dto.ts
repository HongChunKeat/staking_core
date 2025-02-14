import { Matches } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants/role-type';
import {
  EnumField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { type UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  /**
   * web3address start with "0x" followed by 40 hexadecimal characters (0-9, a-f)
   */
  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  web3Address!: string | null;

  @StringFieldOptional({ nullable: true })
  nickname?: string | null;

  @EnumField(() => RoleType)
  role!: RoleType;

  constructor(user: UserEntity) {
    super(user);
    this.web3Address = user.web3Address;
    this.nickname = user.nickname;
    this.role = user.role;
  }
}
