import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SettingsModule, AuthModule, DatabaseModule } from './modules';
import { LoggerMiddleware } from './middlewares';
import { HttpExceptionFilter } from './filters';

@Module({
  imports: [DatabaseModule, SettingsModule, AuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
