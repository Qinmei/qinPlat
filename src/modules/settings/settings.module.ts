import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Settings } from './settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  exports: [SettingsService],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
