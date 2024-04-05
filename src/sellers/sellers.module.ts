import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SellersController],
  providers: [SellersService, JwtService],
})
export class SellersModule {}
