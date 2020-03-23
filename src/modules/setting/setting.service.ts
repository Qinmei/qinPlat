import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: Partial<Setting>): Promise<undefined | Setting> {
    const result = await this.settingRepository.findOne(user);
    return result;
  }

  async validateToken(token: string): Promise<boolean> {
    const data = this.jwtService.verify(token);
    const setting = await this.find();
    if (setting && setting.name === data.name) {
      return true;
    }
    return false;
  }

  async generateToken(user: Partial<Setting>) {
    const payload = { name: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async find(): Promise<Setting | undefined> {
    return await this.settingRepository.findOne();
  }

  async create(data: Partial<Setting>): Promise<any | undefined> {
    return await this.settingRepository.save(data);
  }

  async update(id: number, data: Partial<Setting>): Promise<any | undefined> {
    return await this.settingRepository.update(id, data);
  }

  async clear(): Promise<any | undefined> {
    return await this.settingRepository.clear();
  }
}
