import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateDto } from './dto/create.dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async find() {
    return await this.settingService.find();
  }

  @Post()
  async create(@Body() createSettingDto: CreateDto) {
    return await this.settingService.create(createSettingDto);
  }
}
