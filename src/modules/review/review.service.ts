import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';
import { MenuReview, Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaservice: PrismaService) {}

  async create(data: CreateReviewDto, studentCode: string): Promise<Review> {
    const menu = await this.prismaservice.menu.findFirst({
      where: {
        name: data.menu,
      },
    });

    if (!menu) {
      throw new BadRequestException('메뉴 이름을 확인해주세요.');
    }

    const menuReview = await this.prismaservice.menuReview.upsert({
      where: {
        menu_name: menu.name,
      },
      create: { menu: { connect: { name: menu.name } } },
      update: {},
    });

    const result = await this.prismaservice.review.create({
      data: {
        rate: data.rate,
        writer: { connect: { studentCode: studentCode } },
        menuReview: { connect: { menu_name: data.menu } },
      },
    });

    await this.prismaservice.menuReview.update({
      where: { id: menuReview.id },
      data: { review_id: result.id },
    });

    const update = await this.updateRate(menu.name);

    return result;
  }

  async updateRate(menuName: string): Promise<any> {
    const MenuReview = await this.prismaservice.menuReview.findFirst({
      where: { menu_name: menuName },
    });
    const Reviews = await this.prismaservice.review.findMany({
      where: { rateId: MenuReview.id },
    });

    let sum = 0;
    Reviews.forEach((item) => {
      sum += item.rate;
    });
    const rate = sum / Reviews.length;
    const result = await this.prismaservice.menuReview.updateMany({
      where: { menu_name: menuName },
      data: { rate: rate },
    });

    return result;
  }
}
