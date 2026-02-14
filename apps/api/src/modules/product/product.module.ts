import { Module } from '@nestjs/common';
import { ProductController, CategoryController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Module({
  controllers: [ProductController, CategoryController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
