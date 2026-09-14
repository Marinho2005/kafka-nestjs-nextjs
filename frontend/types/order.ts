export type OrderStatus = 'CRIADO' | 'EM_PREPARO' | 'EM_ENTREGA' | 'ENTREGUE';

export interface Order {
  id: string;
  customerName: string;
  item: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderDto {
  customerName: string;
  item: string;
}

export interface StatusVisualConfig {
  label: string;
  step: number; // 1 a 4
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  description: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusVisualConfig> = {
  CRIADO: {
    label: 'CRIADO',
    step: 1,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-400',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
    dotColor: 'bg-amber-500',
    description: 'Pedido registrado e enviado para o Kafka',
  },
  EM_PREPARO: {
    label: 'EM PREPARO',
    step: 2,
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-400',
    badgeBorder: 'border-orange-200 dark:border-orange-800/60',
    dotColor: 'bg-orange-500',
    description: 'Cozinha preparando os itens do pedido',
  },
  EM_ENTREGA: {
    label: 'EM ENTREGA',
    step: 3,
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-400',
    badgeBorder: 'border-blue-200 dark:border-blue-800/60',
    dotColor: 'bg-blue-500',
    description: 'Entregador a caminho do destino',
  },
  ENTREGUE: {
    label: 'ENTREGUE',
    step: 4,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
    dotColor: 'bg-emerald-500',
    description: 'Pedido finalizado e entregue com sucesso',
  },
};

/**
 * Normaliza o status garantindo que retorne um dos 4 status suportados
 */
export function normalizeOrderStatus(status: unknown): OrderStatus {
  if (typeof status !== 'string') return 'CRIADO';
  const s = status.toUpperCase().replace(/\s+/g, '_').trim();
  if (s === 'EM_PREPARO' || s === 'PREPARING' || s === 'EM PREPARO') return 'EM_PREPARO';
  if (s === 'EM_ENTREGA' || s === 'DELIVERING' || s === 'IN_TRANSIT' || s === 'EM ENTREGA') return 'EM_ENTREGA';
  if (s === 'ENTREGUE' || s === 'DELIVERED') return 'ENTREGUE';
  return 'CRIADO';
}
