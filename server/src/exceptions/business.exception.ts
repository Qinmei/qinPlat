import { HttpStatus, HttpException } from '@nestjs/common';
import { CodeMsg } from './errorCode';

export class BusinessException extends HttpException {
  constructor(message: CodeMsg) {
    super(message, HttpStatus.OK);
  }
}
