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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCustomersQuery } from './type/get-customers-query.type';
import { SellerGuard } from 'src/auth/seller/seller.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Admin access')
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('admin/customers')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(AdminGuard)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('admin/customers')
  @UseGuards(AdminGuard)
  findAll(@Query() query: GetCustomersQuery) {
    return this.customersService.findAll(query);
  }

  @Get('seller/customers')
  @UseGuards(SellerGuard)
  findAllCustomers(@Query() query: GetCustomersQuery) {
    return this.customersService.findAll(query);
  }

  @ApiParam({ name: 'id' })
  @Get('admin/customers:id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch('admin/customers:id')
  @UseGuards(AdminGuard)
  update(
    @Param('admin/customers/id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete('/admin/customers/:id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
