import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, JwtService],
})
export class BrandsModule {}
