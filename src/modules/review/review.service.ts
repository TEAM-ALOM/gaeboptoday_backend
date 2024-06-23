import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';
import { Prisma, Review } from '@prisma/client';
import { UpdateReviewDto } from './review.update-dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaservice: PrismaService) {}

  async create(data: CreateReviewDto, userId): Promise<Review> {
    const offset = 9 * 60 * 60 * 1000;
    const queryDate =
      new Date(`${2024}-${data.month}-${data.day}`).getTime() + offset;
    const weekly = await this.prismaservice.weekly.findFirst({
      include: {
        content: {
          include: {
            lunch: { include: { reviews: true } },
            dinner: { include: { reviews: true } },
          },
        },
      },
      where: {
        day: { equals: new Date(queryDate) },
      },
    });
    if (!weekly) {
      throw new BadRequestException('메뉴 정보가 잘못되었습니다.');
    }
    let menu;
    if (data.diet == 0) {
      menu = weekly.content[0].lunch.filter((item) => item.name == data.menu);
    } else {
      menu = weekly.content[0].dinner.filter((item) => item.name == data.menu);
    }
    if (!menu) {
      throw new BadRequestException('메뉴 정보가 잘못되었습니다.');
    }

    const existReview = await this.prismaservice.review.findFirst({
      where: {
        menu_name: data.menu,
        month: data.month,
        day: data.day,
        diet: data.diet,
        writer_id: userId,
      },
    });
    if (existReview) {
      throw new BadRequestException(
        '이미 이 식단에 대해 리뷰를 작성하셨습니다.',
      );
    }

    const user = await this.prismaservice.user.findFirst({
      where: { studentCode: userId },
    });
    console.log(`${user.major} ${user.studentCode.substring(0, 2)}학번`);

    const review = await this.prismaservice.review.create({
      data: {
        rate: data.rate,
        substance: data.substance,
        menu: { connect: { name: data.menu } },
        writer: { connect: { studentCode: userId } },
        nickname: `${user.major} ${user.studentCode.substring(0, 2)}학번`,
        month: data.month,
        day: data.day,
        diet: data.diet,
      },
    });

    await this.updateMenuRating(data.menu);

    return review;
  }

  async updateMenuRating(menuName: string) {
    const averageRating = await this.prismaservice.review.aggregate({
      _avg: {
        rate: true,
      },
      where: {
        menu_name: menuName,
      },
    });

    await this.prismaservice.menu.update({
      where: {
        name: menuName,
      },
      data: {
        rating: averageRating._avg.rate,
      },
    });
  }

  async findByMenuName(menuName: string): Promise<Review[]> {
    const reviews = await this.prismaservice.review.findMany({
      where: {
        menu: {
          name: menuName,
        },
      },
    });
    return reviews;
  }

  async updateOneById(
    data: UpdateReviewDto,
    userId: string,
    id: string,
  ): Promise<Review> {
    const content: Prisma.ReviewUpdateInput = {
      rate: data.rate,
      substance: data.substance,
    };
    const review = await this.prismaservice.review.findFirst({
      where: {
        id: id,
      },
    });

    if (review.writer_id != userId) {
      throw new BadRequestException('자신의 리뷰만 수정할 수 있습니다.');
    }

    const result = await this.prismaservice.review.update({
      data: content,
      where: {
        id: id,
      },
    });

    await this.updateMenuRating(result.menu_name);

    return result;
  }

  async deleteOneById(id: string, userId: string): Promise<void> {
    const review = await this.prismaservice.review.findFirst({
      where: {
        id: id,
      },
    });
    if (review.writer_id !== userId) {
      throw new BadRequestException('자신의 리뷰만 삭제할 수 있습니다.');
    }
    await this.prismaservice.review.delete({
      where: {
        id: id,
      },
    });
    await this.updateMenuRating(review.menu_name);
  }
}
