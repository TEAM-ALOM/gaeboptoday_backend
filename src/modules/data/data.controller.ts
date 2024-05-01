import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataService } from './data.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { Data } from '@prisma/client';

@ApiTags('계밥 데이터 API')
@Injectable()
@Controller('/data')
export class DataController {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly dataservice: DataService,
  ) {}

  @ApiOperation({
    summary: '이번주 계밥 데이터 가져오기',
  })
  @ApiResponse({
    type: ResponseDto<Data>,
  })
  @Get()
  async getData(): Promise<ResponseDto<Data>> {
    const result = await this.dataservice.getData();
    return ResponseDto.success('inqury_success', result);
  }
}
