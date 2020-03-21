import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AllModules } from './modules';
import { AllMiddleware } from './middlewares';
import { AllFilters } from './filters';
import { AllInterceptors } from './interceptors';
import { AllGuards } from './guards';

@Module({
  imports: AllModules,
  providers: [...AllFilters, ...AllInterceptors, ...AllGuards],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...AllMiddleware).forRoutes('/');
  }
}
