import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  async create(
    @CurrentUser() user: any,
    @Body()
    body: {
      shippingAddressId: string;
      billingAddressId?: string;
      notes?: string;
    },
  ) {
    return this.orderService.create(user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.orderService.findAll(user.id, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findById(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.orderService.findById(user.id, orderId);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  async findByOrderNumber(
    @CurrentUser() user: any,
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.orderService.findByOrderNumber(user.id, orderNumber);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  async cancel(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.orderService.cancel(user.id, orderId);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiOperation({ summary: 'Update order status (Admin/Vendor only)' })
  async updateStatus(@Param('id') orderId: string, @Body() body: { status: OrderStatus }) {
    return this.orderService.updateStatus(orderId, body.status);
  }
}
