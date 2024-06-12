import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Data, Weekly } from '@prisma/client';
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

  async queryData(queryRaw: DataQueryDto): Promise<Data[] | Data | Weekly> {
    const offset = 9 * 60 * 60 * 1000;
    const queryDate =
      new Date(`${2024}-${queryRaw.month}-${queryRaw.day}`).getTime() + offset;
    if (queryRaw.type == 0) {
      const result = [];
      const data = await this.prismaservice.weekly.findFirst({
        include: {
          content: {
            include: { lunch: true, dinner: true },
          },
        },
        where: {
          day: { equals: new Date(queryDate) },
        },
      });
      result.push(data);
      return result;
    } else {
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
