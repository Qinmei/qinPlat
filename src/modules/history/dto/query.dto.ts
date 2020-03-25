import { IsNumber, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsNumber()
  @Type(() => Number)
  readonly page: number = 1;

  @IsNumber()
  @Type(() => Number)
  readonly size: number = 10;

  @IsIn(['DESC', 'ASC'])
  readonly sortOrder: string = 'ASC';

  @IsIn(['id', 'createdAt', 'time', 'url'])
  readonly sortBy: string = 'id';
}
