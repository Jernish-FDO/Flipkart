import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() body: { firstName?: string; lastName?: string; phone?: string },
  ) {
    return this.userService.updateProfile(user.id, body);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  async getAddresses(@CurrentUser() user: any) {
    return this.userService.getAddresses(user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Create new address' })
  async createAddress(
    @CurrentUser() user: any,
    @Body() body: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
      isDefault?: boolean;
    },
  ) {
    return this.userService.createAddress(user.id, body);
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(
    @CurrentUser() user: any,
    @Param('id') addressId: string,
    @Body() body: {
      fullName?: string;
      phone?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
    },
  ) {
    return this.userService.updateAddress(user.id, addressId, body);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.userService.deleteAddress(user.id, addressId);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get order history' })
  async getOrders(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.userService.getOrderHistory(user.id, page, pageSize);
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get wishlist' })
  async getWishlist(@CurrentUser() user: any) {
    return this.userService.getWishlist(user.id);
  }

  @Post('wishlist/:productId')
  @ApiOperation({ summary: 'Add to wishlist' })
  async addToWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.userService.addToWishlist(user.id, productId);
  }

  @Delete('wishlist/:productId')
  @ApiOperation({ summary: 'Remove from wishlist' })
  async removeFromWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.userService.removeFromWishlist(user.id, productId);
  }
}
