export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: UserDto;
  token: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  categoryId: string;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  total: number;
}

export interface CartItemDto {
  id: string;
  productId: string;
  product: ProductDto;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
  notes?: string;
}

export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}
