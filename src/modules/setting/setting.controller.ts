import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateDto, LoginDto } from './dto';
import { ValidationPipe } from '../../pipes';
import { NoAuth } from '../../decorators';
import { BusinessException, ErrorCode } from '../../exceptions';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post('login')
  @NoAuth(true)
  @UsePipes(ValidationPipe)
  async login(@Body() loginData: LoginDto) {
    const userInfo = await this.settingService.validateUser(loginData);

    if (!userInfo) {
      throw new BusinessException(ErrorCode.PassError);
    }

    const token = await this.settingService.generateToken(userInfo);
    return token;
  }

  @Get()
  async find() {
    return await this.settingService.find();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createSettingDto: CreateDto) {
    const result = await this.settingService.find();
    if (result) {
      return await this.settingService.update(result.id, createSettingDto);
    }
    return await this.settingService.create(createSettingDto);
  }
}
