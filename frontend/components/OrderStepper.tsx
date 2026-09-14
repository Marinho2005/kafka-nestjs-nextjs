'use client';

import React from 'react';
import { OrderStatus, ORDER_STATUS_CONFIG } from '@/types/order';
import { ClipboardList, ChefHat, Bike, CheckCircle2 } from 'lucide-react';

interface OrderStepperProps {
  status: OrderStatus;
}

const STEPS = [
  {
    step: 1,
    statusKey: 'CRIADO' as OrderStatus,
    label: 'Criado',
    shortDesc: 'Kafka Event',
    icon: ClipboardList,
  },
  {
    step: 2,
    statusKey: 'EM_PREPARO' as OrderStatus,
    label: 'Em Preparo',
    shortDesc: 'Cozinha',
    icon: ChefHat,
  },
  {
    step: 3,
    statusKey: 'EM_ENTREGA' as OrderStatus,
    label: 'Em Entrega',
    shortDesc: 'Em Rota',
    icon: Bike,
  },
  {
    step: 4,
    statusKey: 'ENTREGUE' as OrderStatus,
    label: 'Entregue',
    shortDesc: 'Finalizado',
    icon: CheckCircle2,
  },
] as const;

export const OrderStepper: React.FC<OrderStepperProps> = ({ status }) => {
  const currentStep = ORDER_STATUS_CONFIG[status]?.step ?? 1;

  // Progresso percentual da barra: Step 1 = 0%, Step 2 = 33.3%, Step 3 = 66.6%, Step 4 = 100%
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100));

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Linha de fundo */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />

        {/* Linha de progresso ativa */}
        <div
          className="absolute top-4 left-6 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${progressPercent}% * (1 - 48px / 100%))` }}
        />

        {/* Nós dos passos */}
        <div className="relative flex justify-between items-start">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const Icon = s.icon;

            return (
              <div key={s.step} className="flex flex-col items-center group cursor-default">
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-100'
                      : isCurrent
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-110 ring-4 ring-orange-500/20 animate-pulse'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs font-semibold tracking-tight transition-colors ${
                      isCurrent
                        ? 'text-orange-600 dark:text-orange-400'
                        : isCompleted
                        ? 'text-zinc-800 dark:text-zinc-200'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="hidden sm:block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {s.shortDesc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
