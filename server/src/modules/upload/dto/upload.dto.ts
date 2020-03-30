import { IsArray, IsNumber } from 'class-validator';

export class UploadDto {
  @IsArray()
  readonly range: number[];

  @IsNumber()
  readonly size: number;
}
