import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAddressDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const protocol = req.protocol;
    const host = req.get('Host');
    const originUrl = req.originalUrl;

    const fullUrl: URL = new URL(protocol + '://' + host + originUrl);
    return fullUrl;
  },
);
