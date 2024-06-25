import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';
import { Review } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { UpdateReviewDto } from './review.update-dto';

@ApiTags('리뷰 API')
@Injectable()
@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewservice: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '리뷰 작성 API' })
  @ApiBody({
    type: CreateReviewDto,
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    type: ResponseDto<Review>,
  })
  @UseGuards(JwtAccessGuard)
  async createReview(
    @Req() request: any,
    @Body() data: CreateReviewDto,
  ): Promise<ResponseDto<Review>> {
    const result = await this.reviewservice.create(
      data,
      request.user.studentCode,
    );
    return ResponseDto.created('create_success', result);
  }

  @ApiOperation({ summary: '리뷰 쿼리 API' })
  @ApiParam({
    description: '조회할 리뷰의 대상 메뉴 이름입니다.',
    type: String,
    name: 'name',
  })
  @ApiResponse({
    type: ResponseDto<Review[]>,
  })
  @Get(':name')
  async getReviews(
    @Param('name') name: string,
  ): Promise<ResponseDto<Review[]>> {
    const result = await this.reviewservice.findByMenuName(name);
    return ResponseDto.success('inquery_success', result);
  }

  @ApiOperation({
    summary: '리뷰 수정 API',
    description: '로그인이 필요한 api입니다.',
  })
  @ApiParam({
    description: '수정할 리뷰의 id입니다.',
    type: String,
    name: 'id',
  })
  @ApiBearerAuth('token')
  @ApiBody({
    description: '수정할 데이터입니다. CreateReviewDto의 Partial 타입입니다.',
  })
  @ApiResponse({
    type: ResponseDto<Review>,
  })
  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    data: UpdateReviewDto,
    @Req() request,
  ): Promise<ResponseDto<Review>> {
    const result = await this.reviewservice.updateOneById(
      data,
      id,
      request.user.studentCode,
    );
    return ResponseDto.success('update_success', result);
  }

  @ApiOperation({
    summary: '리뷰 삭제 API',
    description: '로그인이 필요한 api입니다.',
  })
  @ApiParam({
    description: '삭제할 리뷰의 id입니다.',
    type: String,
    name: 'id',
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    type: ResponseDto<Review>,
  })
  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  async deleteReview(
    @Param('id') id: string,
    @Req() request,
  ): Promise<ResponseDto<void>> {
    const result = await this.reviewservice.deleteOneById(
      id,
      request.user.studentCode,
    );
    return ResponseDto.success('delete_success');
  }
}
