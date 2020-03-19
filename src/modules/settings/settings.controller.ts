import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateDto } from './dto/create.dto';
import { ForbiddenException } from '../../exceptions/forbidden.exception';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async find() {
    throw new ForbiddenException();

    return await this.settingsService.find();
  }

  @Post()
  async create(@Body() createSettingDto: CreateDto) {
    return await this.settingsService.create(createSettingDto);
  }
}
