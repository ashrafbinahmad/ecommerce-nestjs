import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Customer } from './entities/customer.entity';
import { GetCustomersQuery } from './type/get-customers-query.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer | void> {
    const newCustomer = await this.prisma.customer
      .create({
        data: {
          email: createCustomerDto.email,
          hash: await bcrypt.hash(createCustomerDto.password, 10),
          fullname: createCustomerDto.fullname,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError)
          throw new ForbiddenException('Email already exists.');
      });
    return newCustomer;
  }

  async findAll(query: GetCustomersQuery): Promise<Customer[]> {
    console.log(query);
    let pageSize = parseInt(query.size);
    let page = (parseInt(query.page) - 1) * pageSize;
    if (page < 0 || !page) page = undefined;
    if (pageSize < 0 || !pageSize) pageSize = undefined;
    delete query.page;
    delete query.size;
    const filteredCustomers = await this.prisma.customer.findMany({
      where: {
        email: query.email,
        fullname: query.fullname,
      },
      skip: page,
      take: pageSize,
    });
    return filteredCustomers;
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found.');
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        email: updateCustomerDto.email,
        fullname: updateCustomerDto.fullname,
        hash: await bcrypt.hash(updateCustomerDto.password, 10),
      },
    });
    return updatedCustomer;
  }

  async remove(id: number) {
    const deletedCustomer = await this.prisma.customer
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new ForbiddenException('Customer does not exist.');
      });

    return deletedCustomer;
  }
}
