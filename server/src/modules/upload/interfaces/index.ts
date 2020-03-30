export interface UploadData {
  readonly uuid: string;
  readonly file: any;
  readonly range: number[];
  readonly size: number;
}
