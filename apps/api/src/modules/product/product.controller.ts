import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoryId') categoryId?: string,
    @Query('vendorId') vendorId?: string,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('isActive') isActive?: boolean,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
  ) {
    return this.productService.findAll({
      page,
      pageSize,
      categoryId,
      vendorId,
      isFeatured,
      isActive,
      minPrice,
      maxPrice,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin/Vendor only)' })
  async create(
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      shortDescription?: string;
      sku: string;
      price: number;
      compareAtPrice?: number;
      costPrice?: number;
      categoryId: string;
      vendorId?: string;
      images?: any[];
      attributes?: any;
      isFeatured?: boolean;
      isActive?: boolean;
      stockQuantity?: number;
      lowStockThreshold?: number;
      weight?: number;
      dimensions?: any;
      metaTitle?: string;
      metaDescription?: string;
    },
  ) {
    return this.productService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin/Vendor only)' })
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      slug?: string;
      description?: string;
      shortDescription?: string;
      price?: number;
      compareAtPrice?: number;
      costPrice?: number;
      categoryId?: string;
      vendorId?: string;
      images?: any[];
      attributes?: any;
      isFeatured?: boolean;
      isActive?: boolean;
      stockQuantity?: number;
      lowStockThreshold?: number;
      weight?: number;
      dimensions?: any;
      metaTitle?: string;
      metaDescription?: string;
    },
  ) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll() {
    return this.productService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findById(@Param('id') id: string) {
    return this.productService.findCategoryById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category (Admin only)' })
  async create(
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      image?: string;
      parentId?: string;
      isActive?: boolean;
      displayOrder?: number;
    },
  ) {
    return this.productService.createCategory(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      parentId?: string;
      isActive?: boolean;
      displayOrder?: number;
    },
  ) {
    return this.productService.updateCategory(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  async delete(@Param('id') id: string) {
    return this.productService.deleteCategory(id);
  }
}
