import { IsString, IsBoolean } from 'class-validator';

export class CreateDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
