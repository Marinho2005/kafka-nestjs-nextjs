'use client';

import React from 'react';
import { OrderStatus, Order, normalizeOrderStatus } from '@/types/order';
import { Package, Clock, ChefHat, Bike, CheckCircle2, Radio } from 'lucide-react';

interface OrderStatsProps {
  orders: Order[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  isConnected: boolean;
}

export const OrderStats: React.FC<OrderStatsProps> = ({
  orders,
  selectedFilter,
  onSelectFilter,
  isConnected,
}) => {
  const counts: Record<OrderStatus, number> = {
    CRIADO: 0,
    EM_PREPARO: 0,
    EM_ENTREGA: 0,
    ENTREGUE: 0,
  };

  orders.forEach((o) => {
    const status = normalizeOrderStatus(o.status);
    if (counts[status] !== undefined) {
      counts[status]++;
    }
  });

  const cards = [
    {
      id: 'ALL',
      title: 'Total de Pedidos',
      count: orders.length,
      icon: Package,
      color: 'text-zinc-600 dark:text-zinc-300',
      bg: 'bg-zinc-100 dark:bg-zinc-800/80',
      border: 'border-zinc-200 dark:border-zinc-800',
      activeBorder: 'ring-2 ring-zinc-500',
    },
    {
      id: 'CRIADO',
      title: 'Criados',
      count: counts.CRIADO,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-900/30',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'EM_PREPARO',
      title: 'Em Preparo',
      count: counts.EM_PREPARO,
      icon: ChefHat,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-200 dark:border-orange-900/30',
      activeBorder: 'ring-2 ring-orange-500',
    },
    {
      id: 'EM_ENTREGA',
      title: 'Em Entrega',
      count: counts.EM_ENTREGA,
      icon: Bike,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-200 dark:border-blue-900/30',
      activeBorder: 'ring-2 ring-blue-500',
    },
    {
      id: 'ENTREGUE',
      title: 'Entregues',
      count: counts.ENTREGUE,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-200 dark:border-emerald-900/30',
      activeBorder: 'ring-2 ring-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border ${card.border} text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
              isSelected ? `${card.activeBorder} shadow-md` : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {card.count}
              </span>
            </div>
          </button>
        );
      })}

      {/* Card de Status do Broker Kafka */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-medium text-zinc-300">Fluxo Kafka</span>
          <div className="p-1.5 rounded-lg bg-white/10 text-orange-400">
            <Radio className={`w-4 h-4 ${isConnected ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs font-semibold tracking-tight text-zinc-200 truncate block">
            {isConnected ? 'Kafka Ativo' : 'Aguardando NestJS'}
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            Auto-refresh 3s
          </span>
        </div>
      </div>
    </div>
  );
};
