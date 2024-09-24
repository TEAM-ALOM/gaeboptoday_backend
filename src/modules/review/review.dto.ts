import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    example: '맛있고 든든해요 제 최애 메뉴입니다.',
    description: '리뷰 대상 메뉴의 리뷰 내용입니다.',
  })
  @IsString()
  substance: string;

  @ApiProperty({
    example: 12,
    description: '리뷰 대상 메뉴가 나온 월입니다.',
  })
  @IsNumber()
  month: number;

  @ApiProperty({
    example: 6,
    description: '리뷰 대상 메뉴가 나온 일입니다.',
  })
  @IsNumber()
  day: number;

  @ApiProperty({
    example: 0,
    description: '리뷰 대상 메뉴가 나온 식단입니다. 0 - 점심, 1 - 저녁',
  })
  @IsNumber()
  diet: number;
}
