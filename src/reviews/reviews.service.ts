import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Review } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let newReview: Review;
    try {
      if (user.role === 'ADMIN')
        newReview = await this.prisma.review.create({ data: createReviewDto });
      else if (user.role === 'CUSTOMER')
        newReview = await this.prisma.review.create({
          data: { ...createReviewDto, customerId: user.sub },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin or customer.',
        );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      )
        throw new NotFoundException('Some IDs not found.');
      console.log(error);
    }
    return newReview;
  }

  async findAll(getReviewsQuery): Promise<Review[]> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let reviews: Review[];
    try {
      if (userRole === 'SELLER')
        reviews = await this.prisma.review.findMany({
          where: { product: { sellerId: user.sub }, ...getReviewsQuery },
        });
      if (!user)
        reviews = await this.prisma.review.findMany({
          where: getReviewsQuery,
        });
    } catch (error) {}
    return reviews;
  }

  async findOne(id: number): Promise<Review> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let review: Review;
    try {
      review = await this.prisma.review.findFirst({
        where: { id },
      });
    } catch (error) {}
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const user = this.request['user'];
    console.log({ updateReviewDto });
    let updatedReview: Review;
    try {
      if (user?.role === 'ADMIN')
        updatedReview = await this.prisma.review.update({
          where: { id },
          data: {
            comment: updateReviewDto.comment,
            stars: updateReviewDto.stars,
          },
        });
      else if (user?.role === 'CUSTOMER')
        updatedReview = await this.prisma.review.update({
          where: { id, customerId: user.sub },
          data: {
            comment: updateReviewDto.comment,
            stars: updateReviewDto.stars,
          },
          include: {
            product: true,
          },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin or customer.',
        );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.code);
      else throw error;
    }
    return updatedReview;
  }

  async remove(id: number): Promise<Review> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let deletedReview: Review;
    try {
      if (user.role === 'ADMIN')
        deletedReview = await this.prisma.review.delete({
          where: { id },
        });
      else if (user.role === 'CUSTOMER')
        deletedReview = await this.prisma.review.delete({
          where: { id, customerId: user.sub },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin or customer.',
        );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.code);
      else throw error;
    }
    return deletedReview;
  }
}
