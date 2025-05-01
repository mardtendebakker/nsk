import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRecaptchaKeyException extends HttpException {
  constructor() {
    super('Invalid reCAPTCHA secret key provided', HttpStatus.BAD_REQUEST);
  }
}
