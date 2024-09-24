import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataService } from './data.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { Data, Weekly } from '@prisma/client';
import { DataQueryDto } from './types/query.type';

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

  @ApiOperation({
    summary: '계밥 쿼리',
  })
  @ApiResponse({
    type: ResponseDto<Data | Data[]>,
  })
  @ApiBody({
    type: DataQueryDto,
  })
  @Post()
  async queryData(
    @Body() data: DataQueryDto,
  ): Promise<ResponseDto<Data | Data[] | Weekly>> {
    const result = await this.dataservice.queryData(data);
    return ResponseDto.success('inquery_success', result);
  }

  @ApiOperation({
    summary: '데이터 확증',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'OCR 인증을 보낸 후 생성된 데이터의 id',
  })
  @Get('/:id')
  async applyData(@Param('id') id: string) {
    await this.dataservice.deleteManyExceptOne(id);
  }
}
