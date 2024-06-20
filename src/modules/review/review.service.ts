import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaservice: PrismaService) {}

  async create(data: CreateReviewDto, userId): Promise<Review> {
    const menu = this.prismaservice.menu.findFirst({
      where: {
        name: data.menu,
      },
    });
    if (!menu) {
      throw new BadRequestException('메뉴 이름이 잘못되었습니다.');
    }
    const review = await this.prismaservice.review.create({
      data: {
        rate: data.rate,
        substance: data.substance,
        menu: { connect: { name: data.menu } },
        writer: { connect: { studentCode: userId } },
      },
    });

    const averageRating = await this.prismaservice.review.aggregate({
      _avg: {
        rate: true,
      },
      where: {
        menu_name: data.menu,
      },
    });
    await this.prismaservice.menu.update({
      where: {
        name: data.menu,
      },
      data: {
        rating: averageRating._avg.rate,
      },
    });

    return review;
  }
}
