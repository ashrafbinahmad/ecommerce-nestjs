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
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { SellerGuard } from 'src/auth/seller/seller.guard';
import { ApiTags } from '@nestjs/swagger';
import { GetProductsQuery } from './types/get-products-query.type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomFileName } from 'src/files/file.renamer';
import { imageFileFilter } from 'src/files/file.validation';

export type ProductUploadingFiles = {
  thumb_image_url?: Express.Multer.File[];
  image_1_url?: Express.Multer.File[];
  image_2_url?: Express.Multer.File[];
  image_3_url?: Express.Multer.File[];
};

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Post('/admin/products')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumb_image_url', maxCount: 1 },
        { name: 'image_1_url', maxCount: 1 },
        { name: 'image_2_url', maxCount: 1 },
        { name: 'image_3_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploaded_files/products',
          filename: randomFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() uploadedfiles: ProductUploadingFiles,
  ) {
    return await this.productsService.create(createProductDto, uploadedfiles);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Post('/seller/products')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumb_image_url', maxCount: 1 },
        { name: 'image_1_url', maxCount: 1 },
        { name: 'image_2_url', maxCount: 1 },
        { name: 'image_3_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploaded_files/products',
          filename: randomFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  createProductOfSeller(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() uploadedfiles: ProductUploadingFiles,
  ) {
    return this.productsService.create(createProductDto, uploadedfiles);
  }

  @ApiTags('Public access', 'Seller access', 'Customer access', 'Admin access')
  @Get('public/products')
  findAll(@Query() queryParams: GetProductsQuery) {
    return this.productsService.findAll(queryParams);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Get('seller/products')
  findAllProductsOfSeller(@Query() queryParams: GetProductsQuery) {
    return this.productsService.findAll(queryParams);
  }

  @ApiTags('Public access', 'Seller access', 'Customer access', 'Admin access')
  @Get('public/products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Patch('admin/products/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumb_image_url', maxCount: 1 },
        { name: 'image_1_url', maxCount: 1 },
        { name: 'image_2_url', maxCount: 1 },
        { name: 'image_3_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploaded_files/product_categories',
          filename: randomFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        fileIsRequired: false,
      }),
    )
    uploadedfiles: ProductUploadingFiles,
  ) {
    return this.productsService.update(+id, updateProductDto, uploadedfiles);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Patch('seller/products/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumb_image_url', maxCount: 1 },
        { name: 'image_1_url', maxCount: 1 },
        { name: 'image_2_url', maxCount: 1 },
        { name: 'image_3_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploaded_files/product_categories',
          filename: randomFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  updateProductOfTheSeller(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        fileIsRequired: false,
      }),
    )
    uploadedfiles: ProductUploadingFiles,
  ) {
    return this.productsService.update(+id, updateProductDto, uploadedfiles);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Delete('admin/products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Delete('seller/products/:id')
  removeProductOfTheSeller(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
