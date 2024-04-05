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
  Req,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { SellerGuard } from 'src/auth/seller/seller.guard';
import { Brand } from './entities/brand.entity';
import { GetBrandsQuery } from './types/get-brands-query.type';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  fileValidationOptions,
  imageFileFilter,
} from 'src/files/file.validation';
import { diskStorage } from 'multer';
import { randomFileName } from 'src/files/file.renamer';

@Controller()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Post('admin/brands')
  @UseInterceptors(
    FileInterceptor('logo_url', {
      storage: diskStorage({
        destination: './uploaded_files/brands',
        filename: randomFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedFile: Express.Multer.File,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<Brand> {
    return await this.brandsService.create(createBrandDto, uploadedFile);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Post('seller/brands')
  @UseInterceptors(
    FileInterceptor('logo_url', {
      storage: diskStorage({
        destination: './uploaded_files/brands',
        filename: randomFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createBrandBySeller(
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedFile: Express.Multer.File,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<Brand> {
    return await this.brandsService.create(createBrandDto, uploadedFile);
  }

  @ApiTags('Public access', 'Customer access', 'Seller access', 'Admin access')
  @Get('public/brands')
  async findAll(@Query() getBrandsQuery: GetBrandsQuery): Promise<Brand[]> {
    return await this.brandsService.findAll(getBrandsQuery);
  }

  @ApiTags('Public access', 'Customer access', 'Seller access', 'Admin access')
  @Get('public/brands/:id')
  async findOne(@Param('id') id: string): Promise<Brand> {
    return await this.brandsService.findOne(+id);
  }

  @ApiTags('Admin access')
  @Patch('admin/brands/:id')
  @UseInterceptors(
    FileInterceptor('logo_url', {
      storage: diskStorage({
        destination: './uploaded_files/brands',
        filename: randomFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    uploadedFile: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return await this.brandsService.update(+id, updateBrandDto, uploadedFile);
  }

  @ApiTags('Admin access')
  @Delete('admin/brands/:id')
  async remove(@Param('id') id: string): Promise<Brand> {
    return await this.brandsService.remove(+id);
  }
}
