'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Order, CreateOrderDto, normalizeOrderStatus } from '@/types/order';
import { fetchOrders, createOrder } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { CreateOrderForm } from '@/components/CreateOrderForm';
import { OrderStats } from '@/components/OrderStats';
import { OrderFilters } from '@/components/OrderFilters';
import { OrderCard } from '@/components/OrderCard';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import {
  PackageSearch,
  Plus,
  WifiOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const MOCK_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-8f92-a1',
    customerName: 'Lucas Ferreira',
    item: '2x Smash Burger Especial + Batata Rústica',
    status: 'CRIADO',
    createdAt: new Date(Date.now() - 1000 * 20).toISOString(),
  },
  {
    id: 'ord-3c41-b2',
    customerName: 'Mariana Costa',
    item: 'Pizza Artesanal Margherita (Grande)',
    status: 'EM_PREPARO',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: 'ord-7a18-c3',
    customerName: 'Rodrigo Albuquerque',
    item: 'Combo Sushi Premium (32 peças) + Refrigerante',
    status: 'EM_ENTREGA',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'ord-1e94-d4',
    customerName: 'Beatriz Lima',
    item: 'Poke Bowl Salmão Fresh + Suco Natural',
    status: 'ENTREGUE',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
];

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Form de novo pedido
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'amount'>('recent');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const demoCycleCount = useRef(0);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, description?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Simula avanço de status no modo demo para validar visualmente o fluxo Kafka
  const advanceDemoOrders = useCallback(() => {
    setOrders((current) => {
      const active = current
        .map((o, idx) => ({ o, idx }))
        .filter(
          ({ o }) =>
            o.status === 'CRIADO' || o.status === 'EM_PREPARO' || o.status === 'EM_ENTREGA'
        );

      if (active.length === 0) return current;

      const target = active[Math.floor(Math.random() * active.length)];
      let nextStatus = target.o.status;

      if (target.o.status === 'CRIADO') nextStatus = 'EM_PREPARO';
      else if (target.o.status === 'EM_PREPARO') nextStatus = 'EM_ENTREGA';
      else if (target.o.status === 'EM_ENTREGA') nextStatus = 'ENTREGUE';

      if (nextStatus === target.o.status) return current;

      const updated = [...current];
      updated[target.idx] = { ...target.o, status: nextStatus };
      return updated;
    });
  }, []);

  // Consulta GET /orders ao backend NestJS (ou simulação)
  const loadOrders = useCallback(
    async (isManual = false) => {
      if (isManual) setIsRefreshing(true);

      if (isDemoMode) {
        demoCycleCount.current += 1;
        if (demoCycleCount.current % 2 === 0) {
          advanceDemoOrders();
        }
        setLastUpdated(new Date());
        setIsLoading(false);
        if (isManual) setIsRefreshing(false);
        return;
      }

      try {
        const data = await fetchOrders();
        setOrders(data);
        setIsConnected(true);
        setErrorMessage(null);
        setLastUpdated(new Date());
      } catch (err: unknown) {
        console.warn('Backend NestJS indisponível:', err);
        setIsConnected(false);
        const msg =
          err instanceof Error
            ? err.message
            : 'Falha ao conectar com http://localhost:3000/orders';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
        if (isManual) setIsRefreshing(false);
      }
    },
    [isDemoMode, advanceDemoOrders]
  );

  // Polling a cada 3 segundos com GET /orders
  useEffect(() => {
    let ignore = false;

    async function init() {
      if (!ignore) {
        await loadOrders();
      }
    }

    void init();

    if (!isPolling) return;

    const interval = setInterval(() => {
      if (!ignore) {
        void loadOrders();
      }
    }, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [isPolling, loadOrders]);

  // Criação de pedido enviando POST /orders com { customerName, item }
  const handleCreateOrder = async (dto: CreateOrderDto): Promise<boolean> => {
    setIsSubmitting(true);

    if (isDemoMode) {
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        customerName: dto.customerName,
        item: dto.item,
        status: 'CRIADO',
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [newOrder, ...prev]);
      setIsSubmitting(false);
      addToast(
        'success',
        'Pedido Criado (Modo Demo)',
        `Pedido #${newOrder.id} registrado para ${newOrder.customerName}. Em breve avançará para EM PREPARO.`
      );
      return true;
    }

    try {
      const created = await createOrder(dto);
      setOrders((prev) => [created, ...prev]);
      setIsConnected(true);
      setErrorMessage(null);
      addToast(
        'success',
        'Pedido Criado com Sucesso no NestJS!',
        `Pedido #${created.id} emitido para o Kafka (tópico order.created). Status: CRIADO.`
      );
      // Atualiza a lista imediatamente
      void loadOrders();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar ao backend NestJS';
      addToast('error', 'Erro ao Criar Pedido', msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const firstInput = formRef.current?.querySelector('input');
    firstInput?.focus();
  };

  const handleToggleDemoMode = () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setIsLoading(true);
      void loadOrders(true);
      addToast('info', 'Reconectando à API real em http://localhost:3000...');
    } else {
      setIsDemoMode(true);
      setOrders(MOCK_DEMO_ORDERS);
      setIsConnected(false);
      setErrorMessage(null);
      addToast(
        'info',
        'Modo Demo Ativado',
        'Simulando eventos do Kafka a cada ciclo de 3s para teste visual.'
      );
    }
  };

  // Filtragem e busca
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL') {
      const normalized = normalizeOrderStatus(order.status);
      if (normalized !== statusFilter) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchCustomer = order.customerName.toLowerCase().includes(term);
      const matchItem = order.item.toLowerCase().includes(term);
      const matchId = String(order.id).toLowerCase().includes(term);
      if (!matchCustomer && !matchItem && !matchId) return false;
    }

    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    // Default: 'recent'
    return new Date(b.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Barra de Navegação Superior */}
      <Navbar
        isPolling={isPolling}
        onTogglePolling={() => setIsPolling(!isPolling)}
        onManualRefresh={() => loadOrders(true)}
        isRefreshing={isRefreshing}
        onOpenNewOrderModal={handleScrollToForm}
        isConnected={isConnected}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        lastUpdated={lastUpdated}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner amigável quando backend NestJS estiver offline */}
        {!isConnected && !isDemoMode && !isLoading && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span>Backend NestJS em http://localhost:3000 não detectado</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  O painel está fazendo polling a cada 3 segundos tentando reconectar. Certifique-se de que o backend NestJS está rodando (<code className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">npm run start:dev</code> na pasta <code className="font-mono">delivery-backend</code>).
                </p>
                {errorMessage && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                    Detalhe: {errorMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => loadOrders(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reconectar</span>
              </button>
              <button
                type="button"
                onClick={handleToggleDemoMode}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ativar Modo Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Banner informativo de modo demonstração */}
        {isDemoMode && (
          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
              <span>
                <strong>Modo Demo Ativo:</strong> Exibindo simulação dos eventos Kafka. Ao iniciar o backend NestJS na porta 3000, clique em <strong>Usar API Real</strong>.
              </span>
            </div>
            <button
              onClick={handleToggleDemoMode}
              className="px-3 py-1 rounded-lg bg-orange-500 text-white font-semibold text-xs hover:bg-orange-600 transition-colors"
            >
              Usar API Real
            </button>
          </div>
        )}

        {/* Formulário limpo para Criar Pedido (POST /orders com { customerName, item }) */}
        <div ref={formRef}>
          <CreateOrderForm onSubmit={handleCreateOrder} isSubmitting={isSubmitting} />
        </div>

        {/* Estatísticas Rápidas (Cards de Status) */}
        <section aria-label="Métricas de Pedidos">
          <OrderStats
            orders={orders}
            selectedFilter={statusFilter}
            onSelectFilter={(f) => setStatusFilter(f)}
            isConnected={isConnected}
          />
        </section>

        {/* Barra de Filtros e Busca */}
        <section aria-label="Filtros e Busca">
          <OrderFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalFiltered={sortedOrders.length}
          />
        </section>

        {/* Lista de Pedidos Ativos */}
        <section aria-label="Lista de Pedidos">
          {isLoading ? (
            /* Skeleton Loading amigável */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-xl" />
                  <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : sortedOrders.length > 0 ? (
            /* Cards de Pedidos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            /* Estado Vazio */
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <PackageSearch className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {searchTerm || statusFilter !== 'ALL'
                    ? 'Nenhum pedido encontrado com estes filtros'
                    : 'Nenhum pedido registrado ainda'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {searchTerm || statusFilter !== 'ALL'
                    ? 'Tente alterar os termos de busca ou selecionar outro status.'
                    : 'Utilize o formulário acima para registrar o primeiro pedido e disparar o evento no Kafka!'}
                </p>
              </div>

              {searchTerm || statusFilter !== 'ALL' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Limpar Filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Preencher Formulário</span>
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 py-6 bg-white dark:bg-zinc-950 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              DeliveryLive
            </span>
            <span>•</span>
            <span>Next.js App Router + NestJS (porta 3000) + Apache Kafka</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}
              />
              {isConnected ? 'NestJS Conectado' : 'Aguardando NestJS'}
            </span>
            <span>•</span>
            <span>Polling: 3s</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
