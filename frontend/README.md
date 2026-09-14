# 🚀 Delivery Live Tracker - Frontend (Next.js + Tailwind CSS)

Painel de acompanhamento de pedidos de delivery em tempo real, construído com **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS** e ícones **Lucide React**. Projetado para consumir eventos de uma arquitetura orientada a eventos com **NestJS** e **Apache Kafka**.

---

## 📦 Funcionalidades

1. **Acompanhamento de Status em Tempo Real**:
   - **CRIADO**: Pedido registrado no sistema / aguardando processamento.
   - **EM PREPARO**: Cozinha preparando os itens.
   - **EM ENTREGA**: Entregador em rota até o endereço.
   - **ENTREGUE**: Pedido finalizado com sucesso.

2. **Stepper Visual de Evolução**:
   - Barra conectora com gradiente animado e nós circulares indicando o estágio atual, etapas concluídas e pendentes.

3. **Criação de Pedidos (`POST /orders`)**:
   - Botão de destaque **"Fazer Novo Pedido"**.
   - Modal com formulário completo (cliente, item, quantidade, valor, endereço e observações).
   - Atalhos de 1 clique (presets de Burger, Pizza, Sushi e Salada) para testes rápidos e envio direto para o backend NestJS (`http://localhost:3000/orders`).

4. **Polling Automático a cada 3 segundos**:
   - Consulta periódica via `GET http://localhost:3000/orders`.
   - Controles de pausa/retomada do auto-refresh.
   - Botão de atualização manual instantânea.
   - Indicadores visuais de conexão e timestamp da última sincronização.

5. **Modo Demonstração Inteligente**:
   - Caso o backend NestJS na porta 3000 ainda não esteja ligado, o painel ativa automaticamente uma simulação interativa que avança os status dos pedidos a cada ciclo para validar visualmente as transições do Kafka.
   - Assim que o backend NestJS for iniciado, a tela reconecta automaticamente.

6. **Métricas e Filtros**:
   - Resumo com contadores de cada status e volume financeiro total.
   - Busca instantânea por cliente, produto, endereço ou #ID.
   - Filtro rápido por status e ordenação (recentes, antigos, maior valor).

---

## 🛠️ Como Executar

### 1. Entrar na pasta do frontend
```bash
cd frontend
```

### 2. Instalar dependências (caso necessário)
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em:
👉 **[http://localhost:3001](http://localhost:3001)**

> **Nota sobre as Portas:** O frontend foi configurado para rodar na porta **3001** para evitar conflitos com o backend NestJS, que habitualmente roda na porta **3000**.

---

## ⚙️ Variáveis de Ambiente

Arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📁 Estrutura de Pastas

```
frontend/
├── app/
│   ├── globals.css         # Estilização global com Tailwind CSS
│   ├── layout.tsx          # Layout raiz com fontes e metadados
│   └── page.tsx            # Página principal do painel de pedidos
├── components/
│   ├── Navbar.tsx          # Cabeçalho com controles e status de conexão
│   ├── NewOrderModal.tsx   # Modal de criação de pedido com presets
│   ├── OrderCard.tsx       # Card de pedido com badges e detalhes
│   ├── OrderFilters.tsx    # Filtros de busca, status e ordenação
│   ├── OrderStats.tsx      # Métricas resumidas do painel
│   ├── OrderStepper.tsx    # Stepper visual das etapas do pedido
│   └── Toast.tsx           # Notificações visuais flutuantes
├── services/
│   └── api.ts              # Cliente HTTP (GET /orders, POST /orders)
└── types/
    └── order.ts            # Tipagens TypeScript e normalização de status
```
