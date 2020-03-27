import * as fs from 'fs-extra';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import * as rimraf from 'rimraf';
import { Config } from '../../config';
import { File, ParamsData, RenameData, RenameDataArr } from './interfaces';

@Injectable()
export class FileService {
  private readonly basePath: string;
  constructor() {
    const filePath = Config.filePath;
    this.basePath = path.join(__dirname, '../../../../', filePath);
  }

  getParamsFilePath(pathInfo: ParamsData): string {
    const pathArr = Object.values(pathInfo);
    const filePath = path.join(this.basePath, ...pathArr);
    return filePath;
  }

  getFilePath(pathInfo: string): string {
    return path.join(this.basePath, pathInfo);
  }

  async isFile(filePath: string): Promise<boolean> {
    const result = await fs.statSync(filePath);
    return result.isFile();
  }

  async list(pathInfo: ParamsData): Promise<File[]> {
    const filePath = this.getParamsFilePath(pathInfo);

    const data = await fs.readdirSync(filePath);

    const result: File[] = [];
    for (const item of data) {
      const itemInfo = await fs.statSync(filePath + '/' + item);
      const isFile = itemInfo.isFile();
      result.push({
        ...itemInfo,
        type: isFile ? 'fiile' : 'folder',
        name: item,
      });
    }
    return result;
  }

  async create(pathInfo: ParamsData): Promise<fs.Stats> {
    const filePath = this.getParamsFilePath(pathInfo);

    await fs.mkdirSync(filePath, { recursive: true });
    const result = await fs.statSync(filePath);
    return result;
  }

  async rename(pathData: RenameData[]): Promise<boolean> {
    for (const ele of pathData) {
      const { oldPath, newPath } = ele;
      const oldFilePath = this.getFilePath(oldPath);
      const newFilePath = this.getFilePath(newPath);

      await fs.renameSync(oldFilePath, newFilePath);
      await fs.statSync(newFilePath);
    }
    return true;
  }

  async remove(pathArr: string[]): Promise<boolean> {
    for (const ele of pathArr) {
      const item = this.getFilePath(ele);
      const isFile = await fs.statSync(item).isFile();

      if (isFile) {
        await fs.unlinkSync(item);
      } else {
        await rimraf.sync(item);
      }
    }
    return true;
  }

  async move(files: RenameData[]): Promise<boolean> {
    for (const ele of files) {
      const { oldPath, newPath } = ele;
      const oldFilePath = this.getFilePath(oldPath);
      const newFilePath = this.getFilePath(newPath);

      await fs.move(oldFilePath, newFilePath, { overwrite: true });
    }
    return true;
  }

  async copy(files: RenameData[]): Promise<boolean> {
    for (const ele of files) {
      const { oldPath, newPath } = ele;
      const oldFilePath = this.getFilePath(oldPath);
      const newFilePath = this.getFilePath(newPath);

      await fs.copy(oldFilePath, newFilePath);
    }
    return true;
  }
}
