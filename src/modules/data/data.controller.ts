import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataService } from './data.service';

@Injectable()
@Controller('/data')
export class DataController {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly dataservice: DataService,
  ) {}

  @Get()
  async getData() {
    return await this.dataservice.getData();
  }
}
