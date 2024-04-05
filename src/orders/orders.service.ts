import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { GetOrdersQuery } from './types/get-orders-query.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    // console.log('req', this.request);
    let newOrder: Order;
    let orderedProduct: Product;
    try {
      orderedProduct = await this.prisma.product.findFirst({
        where: { id: createOrderDto.productId },
      });
      if (orderedProduct.stock < createOrderDto.quantity)
        throw new BadRequestException('Stock is less than order.');
      if (userRole == 'ADMIN') {
        newOrder = await this.prisma.order.create({
          data: createOrderDto,
        });
      } else if (userRole == 'SELLER' && orderedProduct.sellerId === user.sub) {
        newOrder = await this.prisma.order.create({
          data: createOrderDto,
        });
      } else if (userRole == 'CUSTOMER') {
        newOrder = await this.prisma.order.create({
          data: {
            ...createOrderDto,
            customerId: user.sub,
          },
        });
      } else {
        throw new ForbiddenException(
          'Invalid token, not an admin, customer, or seller.',
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    if (newOrder)
      await this.prisma.product.update({
        where: { id: orderedProduct.id },
        data: { stock: { decrement: createOrderDto.quantity } },
      });
    return newOrder;
  }

  async findAll(getOrdersQuery: GetOrdersQuery) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', user);
    let orders: Order[];

    let pageSize = parseInt(getOrdersQuery?.size);
    let page = (parseInt(getOrdersQuery?.page) - 1) * pageSize;
    if (page < 0 || !page) page = undefined;
    if (pageSize < 0 || !pageSize) pageSize = undefined;
    delete getOrdersQuery.page;
    delete getOrdersQuery.size;
    try {
      if (userRole === 'ADMIN')
        orders = await this.prisma.order
          .findMany({
            where: {
              ...getOrdersQuery,
              product: {
                sellerId: getOrdersQuery.sellerId,
              },
            },
            include: {
              customer: true,
              product: {
                include: {
                  brand: true,
                  product_category: true,
                  Seller: true,
                },
              },
            },
            skip: page,
            take: pageSize,
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      else if (userRole === 'SELLER') {
        orders = await this.prisma.order
          .findMany({
            where: {
              ...getOrdersQuery,
              product: {
                sellerId: user.sub,
              },
            },
            skip: page,
            take: pageSize,
            include: {
              customer: true,
              product: true,
            },
          })
          .catch((error) => {
            console.log(error);
            throw new ForbiddenException();
          });
      } else if (userRole === 'CUSTOMER') {
        orders = await this.prisma.order
          .findMany({
            where: {
              ...getOrdersQuery,
              customerId: user.sub,
              product: {
                sellerId: getOrdersQuery.sellerId,
              },
            },
            skip: page,
            take: pageSize,
            include: {
              customer: true,
              product: {
                include: {
                  brand: true,
                  product_category: true,
                  Seller: true,
                },
              },
            },
          })
          .catch((error) => {
            console.log(error);
            throw new ForbiddenException();
          });
      } else
        throw new ForbiddenException('Invalid token, not an admin or seller.');
    } catch (error) {
      throw error;
    }

    return orders;
  }

  async findOne(id: number) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let order: Order;
    try {
      if (userRole === 'ADMIN')
        order = await this.prisma.order.findFirst({
          where: { id },
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                fullname: true,
              },
            },
            product: {
              include: {
                Seller: {
                  select: {
                    company_name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      else if (userRole === 'SELLER')
        order = await this.prisma.order.findFirst({
          where: { id, product: { sellerId: user.sub } },
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                fullname: true,
              },
            },
            product: {
              include: {
                Seller: {
                  select: {
                    company_name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      else if (userRole === 'CUSTOMER')
        order = await this.prisma.order.findFirst({
          where: { id, customerId: user.sub },
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                fullname: true,
              },
            },
            product: {
              include: {
                Seller: {
                  select: {
                    company_name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin, seller, or customer',
        );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.code);
    }
    if (!order) throw new NotFoundException();

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const user = this.request['user'];
    const userRole = user.role;
    console.log('user', userRole);
    //
    let updatedOrder: Order;
    const existingOrder = await this.prisma.order.findFirst({
      where: { id },
    });

    if (!existingOrder)
      throw new NotFoundException('This order is not found in db.');

    try {
      const orderedProduct = await this.prisma.product.findFirst({
        where: { id: existingOrder.productId },
      });
      if (!orderedProduct)
        throw new NotFoundException('This product is not found in db.');
      if (
        existingOrder &&
        orderedProduct.stock + existingOrder.quantity < updateOrderDto.quantity
      )
        throw new BadRequestException('Stock is less than order.');

      if (userRole === 'ADMIN')
        updatedOrder = await this.prisma.order.update({
          where: { id },
          data: updateOrderDto,
          include: { product: true },
        });
      else if (userRole === 'SELLER')
        updatedOrder = await this.prisma.order.update({
          where: {
            id,
            product: { sellerId: user.sub },
          },
          data: updateOrderDto,
          include: { product: true },
        });
      else if (userRole === 'CUSTOMER') {
        console.log('It is costomer');
        updatedOrder = await this.prisma.order.update({
          where: { id, customerId: user.sub },
          data: { ...updateOrderDto, customerId: user.sub },
          include: { product: true },
        });
      } else
        throw new ForbiddenException(
          'Invalid token, not an admin, seller, or customer',
        );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2008'
      )
        throw new NotFoundException();
      else throw error;
    }
    if (updatedOrder && existingOrder) {
      await this.prisma
        .$transaction([
          this.prisma.product.update({
            where: { id: existingOrder.productId },
            data: { stock: { increment: existingOrder.quantity } },
          }),
          this.prisma.product.update({
            where: { id: existingOrder.productId },
            data: { stock: { decrement: updateOrderDto.quantity } },
          }),
        ])
        .catch((error) => {
          throw error;
        });
    }
    console.log({ updatedOrder });
    // console.log({ existingOrder });
    return updatedOrder;
  }

  async remove(id: number): Promise<Order> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let deletedOrder: Order;
    const existingOrder = await this.prisma.order
      .findFirst({
        where: { id },
      })
      .catch((error) => {
        throw error;
      });
    try {
      if (userRole === 'ADMIN')
        deletedOrder = await this.prisma.order.delete({
          where: { id },
        });
      else if (userRole === 'SELLER')
        deletedOrder = await this.prisma.order.delete({
          where: {
            id,
            product: { sellerId: user.sub },
          },
        });
      else if (userRole === 'CUSTOMER')
        deletedOrder = await this.prisma.order.delete({
          where: { id, customerId: user.sub },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin, seller, or customer',
        );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(error.code);
      } else throw error;
    }
    if (deletedOrder) {
      console.log({ deletedOrder });
      await this.prisma.product.update({
        where: { id: existingOrder.productId },
        data: { stock: { increment: existingOrder.quantity } },
      });
    }
    return deletedOrder;
  }
}
