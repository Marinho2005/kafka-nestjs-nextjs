'use client';

import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: 'recent' | 'oldest' | 'amount';
  onSortChange: (sort: 'recent' | 'oldest' | 'amount') => void;
  totalFiltered: number;
}

const FILTER_BUTTONS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'CRIADO', label: 'Criados' },
  { id: 'EM_PREPARO', label: 'Em Preparo' },
  { id: 'EM_ENTREGA', label: 'Em Entrega' },
  { id: 'ENTREGUE', label: 'Entregues' },
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  totalFiltered,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between py-2">
      {/* Campo de Busca */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por cliente, produto ou #ID..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Botões de Filtro por Status e Ordenação */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Pills de status */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-x-auto">
          {FILTER_BUTTONS.map((btn) => {
            const isActive = statusFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onStatusFilterChange(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Seleção de Ordenação */}
        <div className="relative inline-flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-zinc-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest' | 'amount')}
            className="appearance-none pl-8 pr-8 py-2 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
          >
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="amount">Maior Valor</option>
          </select>
        </div>

        {/* Contador de resultados */}
        <span className="text-xs text-zinc-400 font-medium px-1">
          {totalFiltered} {totalFiltered === 1 ? 'pedido' : 'pedidos'}
        </span>
      </div>
    </div>
  );
};
