import { IsString, IsBoolean } from 'class-validator';
import { isBoolean } from 'util';

export class CreateDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly username: boolean;

  @IsString()
  readonly password: string;
}
