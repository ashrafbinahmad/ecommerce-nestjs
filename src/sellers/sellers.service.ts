import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Seller } from './entities/seller.entity';
import { GetSellersQuery } from './type/get-sellers-query.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}
  async create(createSellerDto: CreateSellerDto): Promise<Seller | void> {
    const newSeller = await this.prisma.seller
      .create({
        data: {
          email: createSellerDto.email,
          hash: await bcrypt.hash(createSellerDto.password, 10),
          company_name: createSellerDto.company_name,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError)
          throw new ForbiddenException('Email already exists.');
      });
    return newSeller;
  }

  async findAll(query: GetSellersQuery): Promise<Seller[]> {
    let pageSize = parseInt(query.size);
    let page = (parseInt(query.page) - 1) * pageSize;
    if (page < 0 || !page) page = undefined;
    if (pageSize < 0 || !pageSize) pageSize = undefined;
    delete query.page;
    delete query.size;
    const filteredSellers = await this.prisma.seller.findMany({
      where: {
        email: query.email,
        company_name: query.company_name,
      },
      skip: page,
      take: pageSize,
    });
    return filteredSellers;
  }

  async findOne(id: number) {
    const seller = await this.prisma.seller.findFirst({
      where: {
        id,
      },
    });
    if (!seller) throw new NotFoundException('Seller not found.');
    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    const updatedSeller = await this.prisma.seller
      .update({
        where: {
          id,
        },
        data: {
          email: updateSellerDto.email,
          company_name: updateSellerDto.company_name,
          hash: await bcrypt.hash(updateSellerDto.password, 10),
        },
      })
      .catch(() => {
        throw new NotFoundException('Seller not found.');
      });
    return updatedSeller;
  }

  async remove(id: number) {
    const deletedSeller = await this.prisma.seller
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new ForbiddenException('Seller does not exist.');
      });

    return deletedSeller;
  }
}
