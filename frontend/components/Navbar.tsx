'use client';

import React from 'react';
import {
  Flame,
  Plus,
  RefreshCw,
  Pause,
  Play,
  Radio,
  Wifi,
  WifiOff,
  Cpu,
} from 'lucide-react';

interface NavbarProps {
  isPolling: boolean;
  onTogglePolling: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  onOpenNewOrderModal: () => void;
  isConnected: boolean;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  lastUpdated: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPolling,
  onTogglePolling,
  onManualRefresh,
  isRefreshing,
  onOpenNewOrderModal,
  isConnected,
  isDemoMode,
  onToggleDemoMode,
  lastUpdated,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Flame className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  Delivery<span className="text-orange-500">Live</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  KAFKA STREAM
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Painel de Acompanhamento em Tempo Real
              </p>
            </div>
          </div>

          {/* Status de Conexão e Controles de Polling */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Badge de Conexão com NestJS */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
              {isDemoMode ? (
                <>
                  <Cpu className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Modo Demo Local</span>
                </>
              ) : isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    NestJS Conectado
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    NestJS Desconectado
                  </span>
                </>
              )}
              {lastUpdated && (
                <span className="text-[11px] text-zinc-400 pl-1 border-l border-zinc-200 dark:border-zinc-700">
                  {lastUpdated.toLocaleTimeString('pt-BR')}
                </span>
              )}
            </div>

            {/* Alternar Modo Demo / Real */}
            <button
              type="button"
              onClick={onToggleDemoMode}
              title={isDemoMode ? 'Alternar para Backend NestJS Real' : 'Alternar para Modo Demo'}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              <span>{isDemoMode ? 'Usar API Real' : 'Simular Demo'}</span>
            </button>

            {/* Controle de Pausa / Retomada do Polling (3s) */}
            <button
              type="button"
              onClick={onTogglePolling}
              title={isPolling ? 'Pausar atualização automática' : 'Ativar atualização automática'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isPolling
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {isPolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Auto 3s: ON</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Auto 3s: OFF</span>
                </>
              )}
            </button>

            {/* Botão de Atualização Manual */}
            <button
              type="button"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="Atualizar agora"
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
            </button>

            {/* Botão de Destaque: Fazer Novo Pedido */}
            <button
              type="button"
              onClick={onOpenNewOrderModal}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="whitespace-nowrap">Fazer Novo Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
