import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/common/database/db.sql',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SettingsModule,
  ],
})
export class AppModule {}
