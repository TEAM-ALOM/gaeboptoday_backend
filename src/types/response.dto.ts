import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, validateSync } from 'class-validator';
import { randomUUID } from 'crypto';

export class ResponseDto<T> {
  @ApiProperty({
    description: '요청 고유 id입니다.',
  })
  @IsString()
  @Expose({ name: 'requestId' })
  requestId: string;

  @ApiProperty({
    example: 200,
    description: '응답 Status Code입니다.',
  })
  @IsNumber()
  @Expose({ name: 'status' })
  status: number;

  @ApiProperty({
    description: '요청에 대한 응답 데이터입니다.',
  })
  data?: T;

  @ApiProperty({
    example: 'inqury_success',
    description: '응답 상태에 대한 설명입니다.',
  })
  @IsString()
  @Expose({ name: 'message' })
  message: string;

  @ApiProperty({
    description: '응답 시간입니다.',
  })
  @IsDate()
  @Expose({ name: 'timestamp' })
  timestamp: Date;

  constructor(data: Partial<ResponseDto<T>>) {
    Object.assign(this, data);
  }

  static of<T>(data: Partial<ResponseDto<T>>) {
    const response = new ResponseDto<T>(data);
    const error = validateSync(response);
    if (error.length > 0) {
      throw error;
    }
    return response;
  }

  static success<T>(message: string, data?: T, status = 200) {
    return ResponseDto.of<T>({
      requestId: randomUUID(),
      message,
      status,
      data,
      timestamp: new Date(),
    });
  }

  static created<T>(message: string, data?: T, status = 201) {
    return ResponseDto.of<T>({
      requestId: randomUUID(),
      message,
      status,
      data,
      timestamp: new Date(),
    });
  }

  static error<T>(message: string, data?: T, status = 500) {
    return ResponseDto.of<T>({
      requestId: randomUUID(),
      message,
      status,
      data,
      timestamp: new Date(),
    });
  }
}
