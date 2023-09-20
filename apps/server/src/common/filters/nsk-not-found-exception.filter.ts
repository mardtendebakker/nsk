import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NskNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request.url.startsWith('/nsk')) {
        return response
        .status(HttpStatus.TEMPORARY_REDIRECT)
        .redirect('https://nexxus.eco');
    }

    return response
      .status(status)
      .json({ message: `Cannot GET ${request.url}`, error: 'Not Found', statusCode: 404 });
  }
}
