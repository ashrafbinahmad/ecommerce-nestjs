import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';
import { CustomerController } from './customer/customer.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, CustomerModule, PrismaModule],
  controllers: [AppController, AuthController, CustomerController],
  providers: [AppService, AuthService, CustomerService],
})
export class AppModule {}
