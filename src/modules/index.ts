import { SettingModule } from './setting/setting.module';
import { DatabaseModule } from './basis/database.module';
import { TokenModule } from './basis/token.module';
import { HistoryModule } from './history/history.module';

const AllModules = [DatabaseModule, HistoryModule, SettingModule];

export {
  DatabaseModule,
  HistoryModule,
  SettingModule,
  TokenModule,
  AllModules,
};
