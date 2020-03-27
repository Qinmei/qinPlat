import * as fs from 'fs';

export interface File extends fs.Stats {
  readonly type: string;
  readonly name: string;
}

export interface ParamsData {
  [propName: string]: string;
}

export interface RenameParamsData {
  file: string;
}

export interface DeleteBatchData {
  files: string[];
}

export interface RenameData {
  oldPath: string;
  newPath: string;
}

export interface RenameDataArr {
  files: RenameData[];
}

export interface CopyOrMove {
  type: 'copy' | 'move';
  files: RenameData[];
}
