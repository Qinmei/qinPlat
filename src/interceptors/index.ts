import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';
import { TransformInterceptor } from './transform.interceptor';

const AllInterceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggerInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
];

export { LoggerInterceptor, TransformInterceptor, AllInterceptors };
