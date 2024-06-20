import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './review.dto';

export type UpdateReviewDto = Partial<CreateReviewDto>;
