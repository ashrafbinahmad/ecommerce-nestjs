import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';
import { GetProductsQuery } from './types/get-products-query.type';
import { REQUEST } from '@nestjs/core';
import { ProductUploadingFiles } from './products.controller';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    uploadedfiles: ProductUploadingFiles,
  ): Promise<Product> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    // console.log('req', this.request);
    createProductDto.thumb_image_url = `files/products/${uploadedfiles?.thumb_image_url[0].filename}`;
    if (createProductDto?.image_1_url)
      createProductDto.image_1_url = `files/products/${uploadedfiles?.image_1_url[0].filename}`;
    if (createProductDto?.image_2_url)
      createProductDto.image_2_url = `files/products/${uploadedfiles?.image_2_url[0].filename}`;
    if (createProductDto?.image_3_url)
      createProductDto.image_3_url = `files/products/${uploadedfiles?.image_3_url[0].filename}`;
    let newProduct;
    if (!userRole || (userRole != 'ADMIN' && userRole != 'SELLER'))
      throw new ForbiddenException('Invalid token, not an admin or seller.');
    try {
      if (userRole == 'ADMIN') {
        newProduct = await this.prisma.product.create({
          data: {
            ...createProductDto,
          },
        });
      } else if (userRole == 'SELLER') {
        newProduct = await this.prisma.product.create({
          data: {
            ...createProductDto,
            sellerId: user.sub,
          },
        });
      } else throw new ForbiddenException('No allowed role found.');
    } catch (error) {
      console.log(error);
      throw error;
    }
    return newProduct;
  }

  async findAll(getProductsQuery: GetProductsQuery): Promise<Product[]> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', user);
    let products;

    let pageSize = parseInt(getProductsQuery.size);
    let page = (parseInt(getProductsQuery.page) - 1) * pageSize;
    let searchText = getProductsQuery.search;
    if (page < 0 || !page) page = undefined;
    if (pageSize < 0 || !pageSize) pageSize = undefined;
    delete getProductsQuery.page;
    delete getProductsQuery.size;
    delete getProductsQuery.search;
    console.log(getProductsQuery);
    if (!user)
      //public
      products = await this.prisma.product.findMany({
        where: {
          ...getProductsQuery,
          OR: [
            {
              name: {
                contains: searchText,
              },
            },
            {
              brand: {
                name: {
                  contains: searchText
                }
              }
            },
            {
              product_category: {
                name: {
                  contains: searchText
                }
              }
            }
          ],
        },
        skip: page,
        take: pageSize,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              logo_url: true,
            },
          },
          product_category: {
            select: {
              id: true,
              name: true,
              icon_url: true,
            },
          },

          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },

          Seller: {
            select: {
              id: true,
              email: true,
              company_name: true,
            },
          },
        },
      });
    else if (userRole === 'SELLER')
      products = await this.prisma.product.findMany({
        where: {
          ...getProductsQuery,
          sellerId: user.sub,
          name: {
            contains: searchText,
          },
        },
        skip: page,
        take: pageSize,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              logo_url: true,
            },
          },
          product_category: {
            select: {
              id: true,
              name: true,
              icon_url: true,
            },
          },

          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      });
    return products;
  }

  findOne(id: number) {
    return this.prisma.product
      .findFirst({
        where: {
          id,
        },
        include: {
          brand: true,
          cart_items: true,
          reviews: true,
          product_category: true,
          Seller: {
            select: {
              email: true,
              company_name: true,
              id: true,
              products: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 5,
              },
              createdAt: true,
            },
          },
          _count: {
            select: {
              orders: true,
              reviews: true,
              cart_items: true,
            },
          },
        },
      })
      .catch((error) => {
        console.log(error);
        // if (error instanceof PrismaNot)
      });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    uploadedfiles: ProductUploadingFiles,
  ) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log(user);
    // if (!userRole || userRole != 'ADMIN' || userRole != 'SELLER')
    //   throw new ForbiddenException('Invalid token, not an admin or seller.');
    console.log({ updateProductDto });
    let updatedPproducts;
    try {
      if (updateProductDto?.thumb_image_url)
        updateProductDto.thumb_image_url = `files/products/${uploadedfiles?.thumb_image_url[0].filename}`;
      if (updateProductDto?.image_1_url)
        updateProductDto.image_1_url = `files/products/${uploadedfiles?.image_1_url[0].filename}`;
      if (updateProductDto?.image_2_url)
        updateProductDto.image_2_url = `files/products/${uploadedfiles?.image_2_url[0].filename}`;
      if (updateProductDto?.image_3_url)
        updateProductDto.image_3_url = `files/products/${uploadedfiles?.image_3_url[0].filename}`;
      if (userRole == 'ADMIN')
        updatedPproducts = await this.prisma.product.update({
          where: {
            id,
          },
          data: {
            ...updateProductDto,
          },
        });
      else if (userRole == 'SELLER')
        updatedPproducts = await this.prisma.product.update({
          where: {
            id,
            sellerId: user.sub,
          },
          data: {
            ...updateProductDto,
          },
        });
    } catch (error) {
      throw error;
    }
    return updatedPproducts;
  }

  async remove(id: number) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log(user);
    if (!userRole && userRole != 'ADMIN' && userRole != 'SELLER')
      throw new ForbiddenException('Invalid token, not an admin or seller.');
    let deletedPproduct;
    try {
      if (userRole == 'ADMIN')
        deletedPproduct = await this.prisma.product.delete({
          where: {
            id,
          },
        });
      else if (userRole == 'SELLER')
        deletedPproduct = await this.prisma.product.delete({
          where: {
            id,
            sellerId: user.sub,
          },
        });
    } catch (error) {}
    if (!deletedPproduct)
      throw new BadRequestException(
        'Product to delete not found or it is connected to another instance.',
      );
    return deletedPproduct;
  }
}
