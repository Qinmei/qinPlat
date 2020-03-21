import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateDto } from './dto/create.dto';
import { ValidationPipe } from '../../pipes/index';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async find() {
    return await this.settingService.find();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createSettingDto: CreateDto) {
    return await this.settingService.create(createSettingDto);
  }
}
