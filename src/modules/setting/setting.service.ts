import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async find(): Promise<Setting | undefined> {
    return await this.settingRepository.findOne();
  }

  async create(data: Partial<Setting>): Promise<any | undefined> {
    return await this.settingRepository.save(data);
  }

  async update(data: Partial<Setting>): Promise<any | undefined> {
    const result = await this.find();
    return await this.settingRepository.update(result.id, data);
  }

  async clear(): Promise<any | undefined> {
    return await this.settingRepository.clear();
  }
}
