import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, JwtService],
})
export class CustomersModule {}
