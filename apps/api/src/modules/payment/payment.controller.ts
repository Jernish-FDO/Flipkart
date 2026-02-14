import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { PaymentMethod } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent for order' })
  async createPaymentIntent(
    @CurrentUser() user: any,
    @Body() body: { orderId: string; method: PaymentMethod },
  ) {
    return this.paymentService.createPaymentIntent(user.id, body.orderId, body.method);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(
    @Body() body: { paymentId: string; stripePaymentId: string },
  ) {
    return this.paymentService.confirmPayment(body.paymentId, body.stripePaymentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(@Body() body: any) {
    return this.paymentService.handleWebhook(body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  async getPaymentDetails(@Param('id') paymentId: string) {
    return this.paymentService.getPaymentDetails(paymentId);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by order ID' })
  async getPaymentByOrder(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.paymentService.getPaymentByOrder(user.id, orderId);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund payment (Admin only)' })
  async refundPayment(@Param('id') paymentId: string) {
    return this.paymentService.refundPayment(paymentId);
  }
}
