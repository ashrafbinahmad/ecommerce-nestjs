import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerService } from './auth/customer/customer.service';
import { CustomerModule } from './auth/customer/customer.module';
import { CustomerController } from './auth/customer/customer.controller';
import { SellerModule } from './auth/seller/seller.module';
import { AdminModule } from './auth/admin/admin.module';
import { SellerController } from './auth/seller/seller.controller';
import { AdminController } from './auth/admin/admin.controller';
import { AdminService } from './auth/admin/admin.service';
import { SellerService } from './auth/seller/seller.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { CustomersModule } from './customers/customers.module';
import { SellersController } from './sellers/sellers.controller';
import { SellersService } from './sellers/sellers.service';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { AuthService } from './auth/auth.service';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { SearchSuggestionsModule } from './search-suggestions/search-suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: './upload',
    }),
    PrismaModule,
    AuthModule,
    CustomerModule,
    SellerModule,
    AdminModule,
    CustomersModule,
    SellerModule,
    ProductsModule,
    BrandsModule,
    ProductCategoriesModule,
    ReviewsModule,
    CartItemsModule,
    OrdersModule,
    FilesModule,
    SearchSuggestionsModule,
  ],
  controllers: [
    AuthController,
    AppController,
    CustomerController,
    SellerController,
    AdminController,
    SellersController,
    OrdersController,
  ],
  providers: [
    AppService,
    CustomerService,
    AdminService,
    SellerService,
    JwtService,
    PrismaService,
    SellersService,
    OrdersService,
    AuthService,
  ],
})
export class AppModule {}
