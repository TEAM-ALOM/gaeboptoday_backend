import { ApiProperty } from '@nestjs/swagger';

export class ImageMappingDto {
  @ApiProperty({
    example: '',
    description: '이미지의 url입니다.',
  })
  imagePath: string;

  @ApiProperty({
    example: '흰밥*흑미밥',
    description: '이미지를 등록할 메뉴의 이름입니다.',
  })
  name: string;
}
