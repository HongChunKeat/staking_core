import { Matches } from 'class-validator';
import { RoleType } from '../../../constants/role-type';
import { EnumFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdateUserDto {
  @StringFieldOptional()
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  web3Address?: string | null;

  @StringFieldOptional({ nullable: true })
  nickname?: string | null;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;
}
