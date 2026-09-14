'use client';

import React, { useState } from 'react';
import { Order, ORDER_STATUS_CONFIG, normalizeOrderStatus } from '@/types/order';
import { OrderStepper } from './OrderStepper';
import {
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  Copy,
  Check,
  User,
  Utensils,
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const status = normalizeOrderStatus(order.status);
  const config = ORDER_STATUS_CONFIG[status];

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(order.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'CRIADO':
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'EM_PREPARO':
        return <ChefHat className="w-4 h-4 text-orange-500" />;
      case 'EM_ENTREGA':
        return <Bike className="w-4 h-4 text-blue-500" />;
      case 'ENTREGUE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recente';
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch {
      return 'Recente';
    }
  };

  const displayId = String(order.id).length > 10
    ? `#${String(order.id).substring(0, 8)}`
    : `#${order.id}`;

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Card: ID e Badge de Status */}
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              title="Copiar ID completo do pedido"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span>{displayId}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
              )}
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(order.createdAt)}
            </span>
          </div>

          {/* Badge de Status */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badgeBg} ${config.badgeBorder} ${config.badgeText}`}
          >
            {getStatusIcon()}
            <span>{config.label}</span>
          </div>
        </div>

        {/* Detalhes: Cliente e Item */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {order.customerName}
              </h3>
              <p className="text-[11px] text-zinc-400">Cliente</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <Utensils className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug break-words">
              {order.item}
            </div>
          </div>
        </div>

        {/* Stepper Visual de Evolução */}
        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <OrderStepper status={status} />
        </div>
      </div>

      {/* Rodapé com descrição da etapa atual */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5 font-medium">
          <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
          Etapa {config.step} de 4
        </span>
        <span className="text-[11px] text-zinc-400 italic truncate max-w-[200px]">
          {config.description}
        </span>
      </div>
    </div>
  );
};
