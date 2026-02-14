import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
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
  }) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    return this.prisma.product.create({
      data: {
        ...data,
        images: data.images || [],
        attributes: data.attributes || {},
      },
      include: {
        category: true,
        vendor: true,
      },
    });
  }

  async findAll(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    vendorId?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params?.vendorId) {
      where.vendorId = params.vendorId;
    }

    if (params?.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) {
        where.price.gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        where.price.lte = params.maxPrice;
      }
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
          },
        },
        variants: {
          where: { deletedAt: null },
        },
        reviews: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
          },
        },
        variants: {
          where: { deletedAt: null },
        },
        reviews: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, data: {
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
  }) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        vendor: true,
      },
    });
  }

  async delete(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    displayOrder?: number;
  }) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new BadRequestException('Category with this slug already exists');
    }

    if (data.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return this.prisma.category.create({
      data,
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    displayOrder?: number;
  }) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productCount = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productCount > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }

    const childCount = await this.prisma.category.count({
      where: { parentId: id, deletedAt: null },
    });

    if (childCount > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
