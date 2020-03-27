import { SettingModule } from './setting/setting.module';
import { DatabaseModule } from './basis/database.module';
import { StaticModule } from './basis/static.module';
import { TokenModule } from './basis/token.module';
import { HistoryModule } from './history/history.module';
import { FileModule } from './file/file.module';

const AllModules = [
  StaticModule,
  DatabaseModule,
  HistoryModule,
  SettingModule,
  FileModule,
];

export {
  DatabaseModule,
  HistoryModule,
  SettingModule,
  TokenModule,
  StaticModule,
  FileModule,
  AllModules,
};
