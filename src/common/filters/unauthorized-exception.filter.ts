import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from 'src/types/response.dto';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response
      .status(status)
      .json(ResponseDto.error('Unauthorized', null, status));
  }
}
