import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchSuggestionsService {
  constructor(private prisma: PrismaService) {}
  async getSuggestionsFor(search_text) {
    let results = [];

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search_text,
            },
          },
          {
            brand: {
              name: {
                contains: search_text,
              },
            },
          },
        ],
      },
      select: {
        name: true,
      },
    });
    const product_results = products.map((product) => {
      const product_name = product.name;
      if (product_name.includes('+'))
        return product_name.substring(0, product_name.indexOf('+'));
      return product_name;
    });

    const brands = await this.prisma.brand.findMany({
      where: {
        name: {
          contains: search_text,
        },
      },
    });
    const brand_results = brands.map((brand) => {
      return brand.name;
    });

    const categories = await this.prisma.product_category.findMany({
      where: {
        name: {
          contains: search_text,
        },
      },
    });
    const category_results = categories.map((category) => {
      return category.name;
    });

    results = [...product_results, ...brand_results, ...category_results];
    return results;
  }
}
