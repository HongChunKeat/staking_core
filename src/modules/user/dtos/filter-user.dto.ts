import { Matches } from 'class-validator';
import { RoleType } from '../../../constants/role-type';
import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators';

export class FilterUserDto {
  @UUIDFieldOptional()
  id?: Uuid;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  @StringFieldOptional()
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  web3Address?: string | null;

  @StringFieldOptional({ nullable: true })
  nickname?: string | null;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;
}
