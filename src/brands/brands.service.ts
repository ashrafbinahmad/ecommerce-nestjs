import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Brand } from './entities/brand.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
  ) {}
  async create(
    createBrandDto: CreateBrandDto,
    uploadedFile: Express.Multer.File,
  ) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    // console.log('req', this.request);
    let newBrand: Brand;
    createBrandDto.logo_url = `files/brands/${uploadedFile.filename}`;
    try {
      if (userRole == 'ADMIN') {
        newBrand = await this.prisma.brand.create({ data: createBrandDto });
      } else if (userRole == 'SELLER') {
        newBrand = await this.prisma.brand.create({
          data: createBrandDto,
        });
      } else {
        throw new ForbiddenException('Invalid token, not an admin or seller.');
      }
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return newBrand;
  }

  async findAll(getBrandsQuery): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({ where: getBrandsQuery });
    return brands;
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand
      .findFirst({ where: { id } })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        )
          throw new NotFoundException();
        throw error;
      });
    return brand;
  }

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    uploadedFile: Express.Multer.File,
  ): Promise<Brand> {
    if (uploadedFile)
      updateBrandDto.logo_url = `files/brands/${uploadedFile.filename}`;
    let updatedBrand;
    try {
      updatedBrand = await this.prisma.brand.update({
        where: { id },
        data: updateBrandDto,
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return updatedBrand;
  }

  async remove(id: number): Promise<Brand> {
    let deletedBrand;
    try {
      deletedBrand = await this.prisma.brand.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return deletedBrand;
  }
}
