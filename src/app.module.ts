import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AllModules } from './modules';
import { LoggerMiddleware } from './middlewares';
import { AllFilters } from './filters';
import { AllInterceptors } from './interceptors';

@Module({
  imports: AllModules,
  providers: [...AllFilters, ...AllInterceptors],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
