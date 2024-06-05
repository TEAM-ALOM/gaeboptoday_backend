import {
  Body,
  Controller,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';
import { Review } from '@prisma/client';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';

@ApiTags('리뷰 API')
@Injectable()
@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewservice: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '리뷰 작성 API' })
  @ApiBody({
    description: '사용자 생성 정보 DTO',
    type: CreateReviewDto,
  })
  @ApiResponse({
    type: ResponseDto<Review>,
  })
  @UseGuards(JwtAccessGuard)
  async createReview(
    @Req() request: any,
    @Body() data: CreateReviewDto,
  ): Promise<ResponseDto<Review>> {
    const result = await this.reviewservice.create(data, request.user.id);
    return ResponseDto.created('create_success', result);
  }
}
