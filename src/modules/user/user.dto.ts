import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '김시윤',
    description: '사용자의 닉네임입니다.',
  })
  @Expose({ name: 'name' })
  @IsString()
  name: string;
}
