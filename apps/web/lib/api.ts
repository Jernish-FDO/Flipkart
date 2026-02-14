const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export const api = new ApiClient();

export const productsApi = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    
    return api.get<any>(`/products?${query.toString()}`);
  },
  
  getById: (id: string) => api.get<any>(`/products/${id}`),
  
  getBySlug: (slug: string) => api.get<any>(`/products/slug/${slug}`),
};

export const categoriesApi = {
  getAll: () => api.get<any[]>('/categories'),
};

export const cartApi = {
  get: (token: string) => api.get<any>('/cart', token),
  
  addItem: (productId: string, quantity: number, token: string) =>
    api.post<any>('/cart/items', { productId, quantity }, token),
  
  updateItem: (productId: string, quantity: number, token: string) =>
    api.put<any>(`/cart/items/${productId}`, { quantity }, token),
  
  removeItem: (productId: string, token: string) =>
    api.delete<any>(`/cart/items/${productId}`, token),
  
  clear: (token: string) => api.delete<any>('/cart', token),
};

export const ordersApi = {
  create: (data: {
    shippingAddressId: string;
    billingAddressId?: string;
    notes?: string;
  }, token: string) => api.post<any>('/orders', data, token),
  
  getAll: (token: string, page?: number, pageSize?: number) => {
    const query = new URLSearchParams();
    if (page) query.append('page', page.toString());
    if (pageSize) query.append('pageSize', pageSize.toString());
    return api.get<any>(`/orders?${query.toString()}`, token);
  },
  
  getById: (id: string, token: string) => api.get<any>(`/orders/${id}`, token),
  
  cancel: (id: string, token: string) => api.put<any>(`/orders/${id}/cancel`, {}, token),
};

export const paymentsApi = {
  createIntent: (orderId: string, method: string, token: string) =>
    api.post<any>('/payments/create-intent', { orderId, method }, token),
  
  confirm: (paymentId: string, stripePaymentId: string, token: string) =>
    api.post<any>('/payments/confirm', { paymentId, stripePaymentId }, token),
};
