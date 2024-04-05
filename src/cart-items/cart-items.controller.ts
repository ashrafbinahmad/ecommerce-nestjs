import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { CartItem } from './entities/cart-item.entity';
import { CustomerGuard } from 'src/auth/customer/customer.guard';
import { GetCartItemQuery } from './types/get-cart-items-query.type';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('admin/cart-items')
  async create(
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemsService.create(createCartItemDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('customer/cart-items')
  async createCartItemOfTheCustomer(
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemsService.create(createCartItemDto);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Get('admin/cart-items')
  async findAll(getCartItemQuery: GetCartItemQuery): Promise<CartItem[]> {
    return await this.cartItemsService.findAll(getCartItemQuery);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Get('customer/cart-items')
  async findAllCartItemsOfTheCustomer(
    getCartItemQuery: GetCartItemQuery,
  ): Promise<CartItem[]> {
    return await this.cartItemsService.findAll(getCartItemQuery);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Get('admin/cart-items/:id')
  async findOne(@Param('id') id: string): Promise<CartItem> {
    return await this.cartItemsService.findOne(+id);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Get('customer/cart-items/:id')
  async findOneCartItemOfTheCustomer(
    @Param('id') id: string,
  ): Promise<CartItem> {
    return await this.cartItemsService.findOne(+id);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Patch('admin/cart-items/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemsService.update(+id, updateCartItemDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Patch('customer/cart-items/:id')
  async updateCartItemOfTheCustomer(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemsService.update(+id, updateCartItemDto);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Delete('admin/cart-items/:id')
  async remove(@Param('id') id: string): Promise<CartItem> {
    return await this.cartItemsService.remove(+id);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Delete('customer/cart-items/:id')
  async removeCartItemOfTheCustomer(
    @Param('id') id: string,
  ): Promise<CartItem> {
    return await this.cartItemsService.remove(+id);
  }
}
