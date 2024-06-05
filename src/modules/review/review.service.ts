import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaservice: PrismaService) {}

  async create(data: CreateReviewDto, studentCcode: string): Promise<Review> {
    const createInput = {
      menu: { connect: { name: data.menu } },
      writer: { connect: { studentCode: studentCcode } },
    };

    return await this.prismaservice.review.create({ data: createInput });
  }
}
