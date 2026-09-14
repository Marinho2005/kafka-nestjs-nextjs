'use client';

import React, { useState } from 'react';
import { CreateOrderDto } from '@/types/order';
import {
  X,
  PlusCircle,
  Sparkles,
  ShoppingBag,
  User,
  MapPin,
  FileText,
  DollarSign,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderDto) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

const QUICK_PRESETS = [
  {
    label: '🍔 Burger Combo',
    item: 'Smash Burger Duplo + Fritas Rústicas + Coca-Cola',
    price: 46.9,
    customer: 'Carlos Eduardo',
    address: 'Av. Paulista, 1578 - Cerqueira César',
  },
  {
    label: '🍕 Pizza Artesanal',
    item: 'Pizza Calabresa Especial (8 fatias) + Borda Recheada',
    price: 64.0,
    customer: 'Juliana Paes',
    address: 'Rua Oscar Freire, 320 - Jardins',
  },
  {
    label: '🍣 Combo Sushi',
    item: 'Combo 30 Peças Premium (Salmão, Atum e Hot Roll)',
    price: 89.9,
    customer: 'Felipe Santos',
    address: 'Rua Fradique Coutinho, 890 - Pinheiros',
  },
  {
    label: '🥗 Salada Bowl',
    item: 'Caesar Salad Crispy + Suco Natural de Maracujá',
    price: 36.5,
    customer: 'Renata Vasconcelos',
    address: 'Rua dos Pinheiros, 450',
  },
];

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState<string>('45.00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setItem(preset.item);
    setTotalAmount(preset.price.toFixed(2));
    setCustomerName(preset.customer);
    setDeliveryAddress(preset.address);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setValidationError('Por favor, informe o nome do cliente.');
      return;
    }
    if (!item.trim()) {
      setValidationError('Por favor, informe o item ou descrição do pedido.');
      return;
    }
    const numericAmount = parseFloat(totalAmount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Informe um valor válido para o pedido.');
      return;
    }

    setValidationError(null);
    await onSubmit({
      customerName: customerName.trim(),
      item: item.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Fazer Novo Pedido
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Envia requisição POST para o backend NestJS (porta 3000)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Alerta de erro se houver */}
          {(validationError || error) && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Atalhos de 1-Clique */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Preenchimento Rápido (Exemplos prontos para teste):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1.5 text-left rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700/50 text-xs text-zinc-700 dark:text-zinc-300 transition-colors font-medium truncate"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nome do Cliente */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Nome do Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Ana Clara Silva"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Item / Descrição */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Item / Produtos do Pedido *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="Ex: 1x Smash Burger Salada + 1x Suco de Laranja"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Quantidade e Preço Total */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="45.00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Endereço de Entrega
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ex: Av. Brigadeiro Faria Lima, 2200 - Apto 81"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Observações do Pedido (opcional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-zinc-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Ponto da carne bem passada, não enviar talheres descartáveis"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>
          </div>

          {/* Ações do Rodapé */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] shadow-md shadow-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando Pedido...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Enviar para NestJS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
