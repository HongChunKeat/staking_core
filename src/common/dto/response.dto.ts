import { BooleanField, StringField } from '../../decorators';

export class ResponseDto {
  @BooleanField()
  success!: boolean;

  @StringField()
  data!: any;

  @StringField()
  message!: string;

  constructor(success = false, data: any) {
    this.success = success;
    this.data = data;
    this.message = success ? 'success' : 'error';
  }
}
