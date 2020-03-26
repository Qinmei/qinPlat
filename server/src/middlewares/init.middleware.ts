import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SettingService } from '../modules/setting/setting.service';
import { Config } from '../config';

@Injectable()
export class InitMiddleware implements NestMiddleware {
  constructor(private readonly settingService: SettingService) {}

  async use(req: Request, res: Response, next: () => void) {
    const result = await this.settingService.find();

    if (!result) {
      await this.settingService.create({
        username: Config.defaultUserName,
        password: Config.defaultPassword,
      });
    }

    next();
  }
}
