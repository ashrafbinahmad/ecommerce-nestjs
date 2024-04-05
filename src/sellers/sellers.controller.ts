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
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AdminGuard } from 'src/auth/admin/admin.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetSellersQuery } from './type/get-sellers-query.type';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Admin access')
@UseGuards(AdminGuard)
@Controller('admin/sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findAll(@Query() query: GetSellersQuery) {
    return this.sellersService.findAll(query);
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersService.remove(+id);
  }
}
