import { Controller, Get, Post, Body } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async find() {
    return await this.historyService.find();
  }
}
