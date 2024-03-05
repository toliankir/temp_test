import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceResponseFail } from '../dto/service-response.dto';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new Logger(HttpException.name);
    logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseBody: ServiceResponseFail = (() => {
      if (exception instanceof NotFoundException) {
        return {
          success: false,
          message: 'Page not found',
        };
      }
      if (exception instanceof UnprocessableEntityException) {
        return {
          success: false,
          message: exception.getResponse()['message'] || 'Unprocessable Entity',
          fails: exception.getResponse()['fails'],
        };
      }
      return {
        success: false,
      };
    })();

    response.status(status).json(responseBody);
  }
}
