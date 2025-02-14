import { Matches } from 'class-validator';
import { EnumField, StringField } from '../../../decorators';
import { RoleType } from '../../../constants/role-type';

export class UserRegisterDto {
  @StringField()
  @Matches(/^0x[0-9a-fA-F]{40}$/)
  readonly web3Address!: string;

  @EnumField(() => RoleType)
  readonly role!: RoleType;
}
