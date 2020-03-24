import { SettingModule } from './setting/setting.module';
import { DatabaseModule } from './basis/database.module';
import { TokenModule } from './basis/token.module';
import { NextModule } from './basis/next.module';
import { HistoryModule } from './history/history.module';

const AllModules = [DatabaseModule, NextModule, HistoryModule, SettingModule];

export {
  DatabaseModule,
  NextModule,
  HistoryModule,
  SettingModule,
  TokenModule,
  AllModules,
};
