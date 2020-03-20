import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateDto } from './dto/create.dto';
import { BusinessException, ErrorCode } from '../../exceptions';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async find() {
    throw new BusinessException(ErrorCode.NameError);

    return await this.settingsService.find();
  }

  @Post()
  async create(@Body() createSettingDto: CreateDto) {
    return await this.settingsService.create(createSettingDto);
  }
}
