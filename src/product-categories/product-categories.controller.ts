import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './entities/product-category.entity';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { SellerGuard } from 'src/auth/seller/seller.guard';
import { GetProductCategoriesQuery } from './types/get-product-categories-query.type';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomFileName } from 'src/files/file.renamer';
import { diskStorage } from 'multer';
import {
  fileValidationOptions,
  imageFileFilter,
} from 'src/files/file.validation';

@Controller()
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Post('admin/product-categories')
  @UseInterceptors(
    FileInterceptor('icon_url', {
      storage: diskStorage({
        destination: './uploaded_files/product_categories',
        filename: randomFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedfile: Express.Multer.File,
  ): Promise<ProductCategory> {
    return await this.productCategoriesService.create(
      createProductCategoryDto,
      uploadedfile,
    );
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Post('seller/product-categories')
  @UseInterceptors(
    FileInterceptor('icon_url', {
      storage: diskStorage({
        destination: './uploaded_files/product_categories',
        filename: randomFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createProductCategoryBySeller(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedfile: Express.Multer.File,
  ): Promise<ProductCategory> {
    return await this.productCategoriesService.create(
      createProductCategoryDto,
      uploadedfile,
    );
  }

  @ApiTags('Public access', 'Customer access', 'Seller access', 'Admin access')
  @Get('public/product-categories')
  async findAll(
    @Query() getProductCategoriesQuery: GetProductCategoriesQuery,
  ): Promise<ProductCategory[]> {
    return await this.productCategoriesService.findAll(
      getProductCategoriesQuery,
    );
  }

  @ApiTags('Public access', 'Customer access', 'Seller access', 'Admin access')
  @Get('public/product-categories/:id')
  async findOne(@Param('id') id: string): Promise<ProductCategory> {
    return await this.productCategoriesService.findOne(+id);
  }

  @ApiTags('Admin access')
  @Patch('admin/product-categories/:id')
  @UseInterceptors(
    FileInterceptor('icon_url', {
      dest: './uploaded_files/product_categories',
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedfile: Express.Multer.File,
  ): Promise<ProductCategory> {
    return await this.productCategoriesService.update(
      +id,
      updateProductCategoryDto,
      uploadedfile,
    );
  }

  @ApiTags('Admin access')
  @Delete('admin/product-categories/:id')
  async remove(@Param('id') id: string): Promise<ProductCategory> {
    return await this.productCategoriesService.remove(+id);
  }
}
