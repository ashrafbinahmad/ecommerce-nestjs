import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService],
})
export class ReviewsModule {}
