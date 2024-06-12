import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DataQueryDto {
  @ApiProperty({ required: true })
  @IsNumber()
  month: number;

  @ApiProperty({ required: true })
  @IsNumber()
  day: number;

  @ApiProperty({ required: true })
  @IsNumber()
  type: number;
}
