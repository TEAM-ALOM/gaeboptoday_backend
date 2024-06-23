import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '김시윤',
    description: '사용자의 이름입니다.',
  })
  @Expose({ name: 'name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '23011583',
    description: '사용자의 학번입니다.',
  })
  @Expose({ name: 'studentCode' })
  @IsString()
  studentCode: string;

  @ApiProperty({
    example: '컴퓨터공학',
    description: '사용자의 전공입니다.',
  })
  @Expose({ name: 'major' })
  @IsString()
  major: string;
}
