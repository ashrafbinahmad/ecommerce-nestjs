import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { GetProductCategoriesQuery } from './types/get-product-categories-query.type';
import { ProductCategory } from './entities/product-category.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
  ) {}
  async create(
    createProductCategoryDto: CreateProductCategoryDto,
    uploadedfile: Express.Multer.File,
  ) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    // console.log('req', this.request);
    createProductCategoryDto.icon_url = `files/product_categories/${uploadedfile.filename}`;
    let newProductCategory;
    try {
      if (userRole == 'ADMIN') {
        newProductCategory = await this.prisma.product_category.create({
          data: createProductCategoryDto,
        });
      } else if (userRole == 'SELLER') {
        newProductCategory = await this.prisma.product_category.create({
          data: createProductCategoryDto,
        });
      } else {
        throw new ForbiddenException('Invalid token, not an admin or seller.');
      }
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return newProductCategory;
  }

  async findAll(
    getProductCategoriesQuery: GetProductCategoriesQuery,
  ): Promise<ProductCategory[]> {
    const productCategories = await this.prisma.product_category.findMany({
      where: getProductCategoriesQuery,
    });
    return productCategories;
  }

  async findOne(id: number) {
    const productCategory = await this.prisma.product_category
      .findFirst({ where: { id } })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        )
          throw new NotFoundException();
        throw error;
      });
    return productCategory;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
    uploadedfile: Express.Multer.File,
  ): Promise<ProductCategory> {
    if (uploadedfile)
      updateProductCategoryDto.icon_url = `files/product_categories/${uploadedfile.filename}`;
    let updatedProductCategory;
    try {
      updatedProductCategory = await this.prisma.product_category.update({
        where: { id },
        data: updateProductCategoryDto,
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return updatedProductCategory;
  }

  async remove(id: number): Promise<ProductCategory> {
    let deletedProductCategory;
    try {
      deletedProductCategory = await this.prisma.product_category.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return deletedProductCategory;
  }
}
