import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '흰밥*흑미밥',
    description: '리뷰 대상 메뉴의 이름입니다.',
  })
  @IsString()
  menu: string;

  @ApiProperty({
    example: '3.2',
    description: '리뷰 대상 메뉴의 평점입니다.',
  })
  @IsNumber()
  rate: number;
}
