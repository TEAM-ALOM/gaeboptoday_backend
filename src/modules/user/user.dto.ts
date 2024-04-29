import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class CreateUserDto {
  @ApiProperty({
    example: '김시윤',
    description: '사용자의 닉네임입니다.'
  })
  @IsString()
  name: string;
}

export default CreateUserDto;
