import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

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
