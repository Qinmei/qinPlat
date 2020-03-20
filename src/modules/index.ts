import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { DatabaseModule } from './database/database.module';
import { HistoryModule } from './history/history.module';

const AllModules = [AuthModule, DatabaseModule, HistoryModule, SettingModule];

export { AuthModule, DatabaseModule, HistoryModule, SettingModule, AllModules };
