import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Data } from '@prisma/client';
import { DataQueryDto } from './types/query.type';

@Injectable()
export class DataService {
  constructor(private readonly prismaservice: PrismaService) {}

  async getData() {
    return await this.prismaservice.data.findFirst({
      include: {
        content: {
          include: { content: { include: { lunch: true, dinner: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async queryData(queryRaw: DataQueryDto): Promise<Data[] | Data> {
    const offset = 9 * 60 * 60 * 1000;
    const queryDate =
      new Date(`${2024}-${queryRaw.month}-${queryRaw.day}`).getTime() + offset;
    return await this.prismaservice.data.findMany({
      include: {
        content: {
          include: { content: { include: { lunch: true, dinner: true } } },
        },
      },
      where: {
        content: {
          some: {
            day: {
              equals: new Date(queryDate),
            },
          },
        },
      },
    });
  }

  async deleteManyExceptOne(id: string) {
    await this.prismaservice.data.deleteMany({
      where: {
        NOT: {
          id: id,
        },
      },
    });

    return await this.getData();
  }
}
