import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from './upload.entity';
import { FileService } from '../file/file.service';
import { Config } from '../../config';
import { QueryDto, CreateDto } from './dto';
import { UploadData } from './interfaces';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly fileService: FileService,
  ) {}

  async list(
    query: QueryDto,
  ): Promise<{ list: Upload[] | undefined; total: number }> {
    const [list, total] = await this.uploadRepository.findAndCount({
      skip: (query.page - 1) * query.size,
      take: query.size,
      order: {
        [query.sortBy]: query.sortOrder,
      },
    });
    return {
      list,
      total,
    };
  }

  async find(uuid: string): Promise<Upload | undefined> {
    return await this.uploadRepository.findOne({ uuid });
  }

  async create(files: any, dir: string): Promise<any | undefined> {
    return await Promise.all(
      files.map(item => this.fileService.createFile(item, dir)),
    );
  }

  async existFileHash(hash: string): Promise<boolean> {
    const exist = await this.fileService.existSameFile(hash);
    return !!exist;
  }

  async createBigFile(data: CreateDto): Promise<any | undefined> {
    const initData = {
      ...data,
      uuid: uuidv4(),
      receive: 0,
      done: false,
    };
    return await this.uploadRepository.save(initData);
  }

  async uploadBigFile(data: UploadData): Promise<any | undefined> {
    const { uuid, start, end, size, file } = data;
    const info = await this.find(uuid);
    const result = await this.fileService.updateFile(
      file,
      info.name,
      info.directory,
    );

    if (result) {
      const done = end === info.size;
      await this.update(info.id, { done, receive: end });
    }
    return true;
  }

  async update(id: number, data: Partial<Upload>): Promise<any | undefined> {
    return await this.uploadRepository.update(id, data);
  }

  async clear(): Promise<any | undefined> {
    return await this.uploadRepository.clear();
  }
}
