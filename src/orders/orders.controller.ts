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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomerGuard } from 'src/auth/customer/customer.guard';
import { ApiTags } from '@nestjs/swagger';
import { SellerGuard } from 'src/auth/seller/seller.guard';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { GetOrdersQuery } from './types/get-orders-query.type';
import { Order } from './entities/order.entity';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiTags('Customer access')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(CustomerGuard)
  @Post('customer/orders')
  async placeOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(createOrderDto);
  }

  @ApiTags('Admin access')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(AdminGuard)
  @Post('admin/orders')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Get('customer/orders')
  async findAllOrdersOfTheCustomer(@Query() getOrdersQuery: GetOrdersQuery) {
    return await this.ordersService.findAll(getOrdersQuery);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Get('seller/orders')
  async findAllOrdersToTheSeller(@Query() getOrdersQuery: GetOrdersQuery) {
    return await this.ordersService.findAll(getOrdersQuery);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Get('admin/orders')
  async findAllOrders(@Query() getOrdersQuery: GetOrdersQuery) {
    return await this.ordersService.findAll(getOrdersQuery);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Get('customer/orders/:id')
  async findOneOrderOfTheCustomer(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Get('seller/orders/:id')
  async findOneOrderToTheSeller(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Get('admin/orders/:id')
  async findOneOrder(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Patch('customer/orders/:id')
  async updateOrderOfTheCustomer(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Patch('seller/orders/:id')
  async updateOrderToTheSeller(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Patch('admin/orders/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @ApiTags('Customer access')
  @UseGuards(CustomerGuard)
  @Delete('customer/orders/:id')
  async removeOrderOfTheCustomer(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }

  @ApiTags('Seller access')
  @UseGuards(SellerGuard)
  @Delete('seller/orders/:id')
  async removeOrderToTheCustomer(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Delete('admin/orders/:id')
  async removeOrder(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }
}
