import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: '23011583',
    description: '학사정보 시스템에서 사용하는 아이디를 적어주세요.',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    example: 'asdfjh138h',
    description: '학사정보 시스템에서 사용하는 비밀번호를 적어주세요.',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
