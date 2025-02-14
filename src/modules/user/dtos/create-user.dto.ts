import { Matches } from 'class-validator';
import { RoleType } from '../../../constants/role-type';
import {
  EnumField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class CreateUserDto {
  @StringField({ nullable: true })
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  web3Address!: string | null;

  @StringFieldOptional({ nullable: true })
  nickname?: string | null;

  @EnumField(() => RoleType)
  role!: RoleType;
}
