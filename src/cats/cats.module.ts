import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { Cat } from './cats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatsService],
  controllers: [CatsController],
})
export class CatsModule {}
