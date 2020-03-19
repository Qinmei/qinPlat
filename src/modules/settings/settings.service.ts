import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async find(): Promise<Settings | undefined> {
    return await this.settingsRepository.findOne();
  }

  async create(data: Partial<Settings>): Promise<any | undefined> {
    return await this.settingsRepository.save(data);
  }

  async update(data: Partial<Settings>): Promise<any | undefined> {
    const result = await this.find();
    return await this.settingsRepository.update(result.id, data);
  }

  async clear(): Promise<any | undefined> {
    return await this.settingsRepository.clear();
  }
}
