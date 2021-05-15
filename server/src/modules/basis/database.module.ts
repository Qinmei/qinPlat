import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/modules/basis/sqlite/db.sqlite',
      autoLoadEntities:true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
