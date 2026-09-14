'use client';

import React, { useState } from 'react';
import { CreateOrderDto } from '@/types/order';
import { User, Utensils, Send, Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateOrderFormProps {
  onSubmit: (dto: CreateOrderDto) => Promise<boolean>;
  isSubmitting: boolean;
}

const QUICK_ITEMS = [
  { customer: 'Lucas Ferreira', item: 'Smash Burger Artesanal + Fritas' },
  { customer: 'Mariana Costa', item: 'Pizza Calabresa Especial (8 fatias)' },
  { customer: 'Rodrigo Lima', item: 'Combo Sushi Master 30 peças' },
  { customer: 'Beatriz Santos', item: 'Açaí Especial 500ml com Frutas' },
];

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Por favor, informe o nome do cliente.');
      return;
    }
    if (!item.trim()) {
      setFormError('Por favor, informe o item ou descrição do pedido.');
      return;
    }

    setFormError(null);
    const ok = await onSubmit({
      customerName: customerName.trim(),
      item: item.trim(),
    });

    if (ok) {
      setCustomerName('');
      setItem('');
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    }
  };

  const handleApplyQuick = (example: (typeof QUICK_ITEMS)[0]) => {
    setCustomerName(example.customer);
    setItem(example.item);
    setFormError(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
      {/* Cabeçalho do formulário */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Fazer Novo Pedido
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Envia <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-orange-600 dark:text-orange-400">POST /orders</code> com JSON <code className="font-mono text-[11px]">&#123; customerName, item &#125;</code> para disparar evento no Kafka.
          </p>
        </div>

        {/* Sugestões rápidas de 1 clique */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Exemplos:
          </span>
          {QUICK_ITEMS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyQuick(q)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 border border-zinc-200 dark:border-zinc-700/80 transition-colors"
            >
              {q.item.split(' ')[0]} {q.item.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de erro de validação */}
      {formError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Alerta de sucesso */}
      {successNotice && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pedido criado com sucesso e publicado no tópico Kafka! Acompanhe o progresso abaixo.</span>
        </div>
      )}

      {/* Campos do Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Campo: Nome do Cliente */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nome do Cliente
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João Silva"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Campo: Item / Pedido */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Item do Pedido
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Utensils className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="Ex: Pizza Calabresa ou Burger Artesanal"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 cursor-pointer h-[42px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Criar Pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
