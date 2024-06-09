import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      orderBy: { createdAt: 'asc' },
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
