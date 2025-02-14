import {
  DateFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '../../../decorators';

export class FilterSettingBlockchainDto {
  @UUIDFieldOptional()
  id?: Uuid;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @StringFieldOptional({ nullable: true })
  group?: string | null;

  @NumberFieldOptional({ isPositive: true })
  chainId?: number | 0;

  @StringFieldOptional({ nullable: true })
  rpcUrl?: string | null;
}
