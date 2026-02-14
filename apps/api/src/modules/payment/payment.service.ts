import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PaymentStatus, PaymentMethod, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(userId: string, orderId: string, method: PaymentMethod) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId, deletedAt: null },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in pending status');
    }

    let stripePaymentId: string | null = null;

    if (method !== PaymentMethod.COD) {
      stripePaymentId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        currency: 'INR',
        status: method === PaymentMethod.COD ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
        method,
        stripePaymentId,
        metadata: {
          userId,
          orderNumber: order.orderNumber,
        },
      },
    });

    if (method === PaymentMethod.COD) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      });
    }

    return {
      ...payment,
      clientSecret: stripePaymentId ? `${stripePaymentId}_secret_test` : null,
    };
  }

  async confirmPayment(paymentId: string, stripePaymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, deletedAt: null },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Payment already confirmed');
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCEEDED,
        stripePaymentId,
      },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.CONFIRMED },
    });

    return this.getPaymentDetails(paymentId);
  }

  async handleWebhook(event: any) {
    const paymentIntent = event.data.object;

    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    let status: PaymentStatus;

    switch (event.type) {
      case 'payment_intent.succeeded':
        status = PaymentStatus.SUCCEEDED;
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED },
        });
        break;

      case 'payment_intent.payment_failed':
        status = PaymentStatus.FAILED;
        break;

      case 'payment_intent.canceled':
        status = PaymentStatus.CANCELLED;
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CANCELLED },
        });
        break;

      default:
        return { received: true };
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });

    return { received: true };
  }

  async getPaymentDetails(paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, deletedAt: null },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentByOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findFirst({
      where: { orderId, deletedAt: null },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, deletedAt: null },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    if (payment.method === PaymentMethod.COD) {
      throw new BadRequestException('COD payments cannot be refunded through this method');
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.REFUNDED },
    });

    return this.getPaymentDetails(paymentId);
  }
}
