import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/modules/basis/sqlite/db.sqlite',
      entities: ['dist/modules/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
