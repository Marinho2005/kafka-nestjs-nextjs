import { CreateOrderDto, Order, normalizeOrderStatus } from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Busca a lista de pedidos no endpoint NestJS GET /orders
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `Erro ao buscar pedidos do backend (${response.status} ${response.statusText})`,
        response.status
      );
    }

    const data = await response.json();
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.orders)
      ? data.orders
      : [];

    return rawList.map((raw: Record<string, unknown>) => ({
      id: String(raw.id ?? `ord-${Math.random().toString(36).substring(2, 7)}`),
      customerName: String(raw.customerName ?? raw.customer ?? 'Cliente Não Informado'),
      item: String(raw.item ?? 'Item Não Informado'),
      status: normalizeOrderStatus(raw.status),
      createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
    }));
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Tempo de conexão esgotado ao contatar http://localhost:3000/orders');
    }
    throw new ApiError(
      'Não foi possível conectar ao backend NestJS em http://localhost:3000/orders. Verifique se o servidor NestJS está rodando.'
    );
  }
}

/**
 * Envia uma requisição POST /orders com { customerName, item } para criar o pedido
 */
export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const payload = {
      customerName: dto.customerName.trim(),
      item: dto.item.trim(),
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `Erro ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.message) {
          errorMsg = Array.isArray(errJson.message)
            ? errJson.message.join(', ')
            : String(errJson.message);
        }
      } catch {
        // payload não era JSON
      }
      throw new ApiError(errorMsg, response.status);
    }

    const raw = await response.json();
    return {
      id: String(raw.id ?? `ord-${Math.random().toString(36).substring(2, 7)}`),
      customerName: String(raw.customerName ?? dto.customerName),
      item: String(raw.item ?? dto.item),
      status: normalizeOrderStatus(raw.status),
      createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Tempo esgotado ao enviar pedido para http://localhost:3000/orders');
    }
    throw new ApiError(
      'Falha ao conectar com o backend em http://localhost:3000/orders. Certifique-se de que o NestJS está ativo.'
    );
  }
}
