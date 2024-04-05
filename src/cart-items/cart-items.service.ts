import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { CartItem } from './entities/cart-item.entity';
import { GetCartItemQuery } from './types/get-cart-items-query.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let newCartItem;
    try {
      if (userRole == 'ADMIN') {
        newCartItem = await this.prisma.cart_item.create({
          data: createCartItemDto,
        });
      } else if (userRole == 'CUSTOMER') {
        newCartItem = await this.prisma.cart_item.create({
          data: { ...createCartItemDto, customerId: user.sub },
        });
      } else {
        throw new ForbiddenException(
          'Invalid token, not an admin or customer.',
        );
      }
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
    return newCartItem;
  }

  async findAll(getCartItemQuery: GetCartItemQuery) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', user);

    let pageSize = parseInt(getCartItemQuery?.size);
    let page = (parseInt(getCartItemQuery?.page) - 1) * pageSize;
    if (!page || page < 0) page = undefined;
    if (!pageSize || pageSize < 0) pageSize = undefined;
    delete getCartItemQuery?.page;
    delete getCartItemQuery?.size;
    let cartItems: CartItem[];
    try {
      if (userRole === 'ADMIN')
        cartItems = await this.prisma.cart_item.findMany({
          where: getCartItemQuery,
          skip: page,
          take: pageSize,
          include: {
            customer: true,
            product: true,
          },
        });
      else if (userRole === 'CUSTOMER') {
        cartItems = await this.prisma.cart_item.findMany({
          where: {
            ...getCartItemQuery,
            customerId: user.sub,
          },
          skip: page,
          take: pageSize,
          include: {
            customer: true,
            product: true,
          },
        });
      } else
        throw new ForbiddenException('Invalid token, not an admin or seller.');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(error.code);
      else throw error;
    }

    return cartItems;
  }

  async findOne(id: number) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let cartItem;
    try {
      if (userRole === 'ADMIN')
        cartItem = await this.prisma.cart_item.findFirst({ where: { id } });
      else if (userRole === 'CUSTOMER')
        cartItem = await this.prisma.cart_item.findFirst({
          where: { id, customerId: user.sub },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin, or customer.',
        );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2008'
      )
        throw new NotFoundException();
    }
    return cartItem;
  }

  async update(id: number, queryParams: UpdateCartItemDto) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let updatedCartItem;
    try {
      if (userRole === 'ADMIN')
        updatedCartItem = await this.prisma.cart_item.update({
          where: { id },
          data: queryParams,
          include: {
            customer: true,
            product: true,
          },
        });
      else if (userRole === 'CUSTOMER')
        updatedCartItem = await this.prisma.cart_item.update({
          where: { id, customerId: user.sub },
          data: queryParams,
          include: {
            product: true,
          },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin, or customer',
        );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2008'
      )
        throw new NotFoundException();
    }

    return updatedCartItem;
  }

  async remove(id: number) {
    const user = this.request['user'];
    const userRole = user?.role;
    console.log('user', userRole);
    let deletedCartItem: CartItem;
    try {
      if (userRole === 'ADMIN')
        deletedCartItem = await this.prisma.cart_item.delete({
          where: { id },
        });
      else if (userRole === 'CUSTOMER')
        deletedCartItem = await this.prisma.cart_item.delete({
          where: { id, customerId: user.sub },
        });
      else
        throw new ForbiddenException(
          'Invalid token, not an admin, or customer',
        );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2008'
      )
        throw new NotFoundException();
    }

    return deletedCartItem;
  }
}
