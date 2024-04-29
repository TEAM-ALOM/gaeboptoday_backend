import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataService } from './data.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  @Get()
  async getData() {
    return await this.dataservice.getData();
  }
}
