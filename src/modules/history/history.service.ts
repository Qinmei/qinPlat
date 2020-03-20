import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async find(): Promise<History[] | undefined> {
    return await this.historyRepository.find();
  }

  async create(data: Partial<History>): Promise<any | undefined> {
    return await this.historyRepository.save(data);
  }

  async clear(): Promise<any | undefined> {
    return await this.historyRepository.clear();
  }
}
