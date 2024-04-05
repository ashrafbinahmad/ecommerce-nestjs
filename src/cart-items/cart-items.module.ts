import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService, JwtService],
})
export class CartItemsModule {}
