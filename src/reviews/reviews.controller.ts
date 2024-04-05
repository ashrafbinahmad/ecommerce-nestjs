import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { CustomerGuard } from 'src/auth/customer/customer.guard';
import { Review } from './entities/review.entity';
import { GetReviewsQuery } from './types/get-reviews-query.type';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('admin/reviews')
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewsService.create(createReviewDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Post('customer/reviews')
  async createCustomerReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.create(createReviewDto);
  }

  @ApiTags('Public access')
  @Get('public/reviews')
  async findAll(getReviewsQuery: GetReviewsQuery): Promise<Review[]> {
    return await this.reviewsService.findAll(getReviewsQuery);
  }

  @ApiTags('Seller access')
  @Get('seller/reviews')
  async findAllReviewsForTheSeller(
    getReviewsQuery: GetReviewsQuery,
  ): Promise<Review[]> {
    return await this.reviewsService.findAll(getReviewsQuery);
  }

  @ApiTags('Public access')
  @Get('public/reviews/:id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOne(+id);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Patch('admin/reviews/:id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.update(+id, updateReviewDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Patch('customer/reviews/:id')
  async updateReviewOfTheCustomer(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.update(+id, updateReviewDto);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Delete('admin/reviews/:id')
  async remove(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.remove(+id);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Delete('customer/reviews/:id')
  async removeReviewOfTheCustomer(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.remove(+id);
  }
}
