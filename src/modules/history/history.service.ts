import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';
import { QueryDto } from './dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async find(query: QueryDto): Promise<History[] | undefined> {
    return await this.historyRepository.find({
      skip: (query.page - 1) * query.size,
      take: query.size,
      order: {
        [query.sortBy]: query.sortOrder,
      },
    });
  }

  async create(data: Partial<History>): Promise<any | undefined> {
    return await this.historyRepository.save(data);
  }

  async clear(): Promise<any | undefined> {
    return await this.historyRepository.clear();
  }
}
