import { BadRequestException } from '@nestjs/common';

export class CustomErrorException extends BadRequestException {
  constructor(data: string[]) {
    super({ data, message: 'error' });
  }
}
