import { Logger, ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorLog } from '@models/core/ErrorLog';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const request = ctx.getRequest();

    const { url, user, headers } = request;

    if (headers && request.method) {
      headers.method = request.method;
    }

    const status = exception instanceof HttpException ? +exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = !exception.stack ? null : exception.stack;

    const errorCode = (exception as any)?.response?.error || undefined;

    const errorMessage: any = (exception as any)?.response?.message || exception?.message || exception;

    let errorDefault: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      code: errorCode,
      message: errorMessage,
    };

    if (typeof errorMessage === 'object' && errorMessage.length) {
      const error = errorMessage.map((message) => ({
        ...errorDefault,
        message,
      }));

      errorDefault = error;
    }

    const errorLog: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      code: errorCode,
      message: (typeof errorMessage === 'object' && JSON.stringify(errorMessage)) || errorMessage,
      request: JSON.stringify(request.body),
      user: JSON.stringify(user),
      reference: JSON.stringify(stack),
      headers: JSON.stringify(headers),
    };
    Logger.log(errorMessage, stack);

    ErrorLog.create(errorLog);
    response.status(status).json({ error: errorDefault });
  }
}
