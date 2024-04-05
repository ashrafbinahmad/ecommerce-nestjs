import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, JwtService],
})
export class ProductCategoriesModule {}
