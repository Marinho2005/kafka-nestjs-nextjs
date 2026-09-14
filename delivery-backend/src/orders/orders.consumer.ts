import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrdersService, Order } from './orders.service';

@Controller()
export class OrdersConsumer {
  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: Order) {
    console.log('Mensagem recebida do Kafka (order.created):', data);

    // Simula as transições de status do pedido ao longo do tempo
    setTimeout(() => {
      this.ordersService.updateOrderStatus(data.id, 'EM_PREPARO');
      console.log(`Pedido ${data.id} atualizado para: EM_PREPARO`);
    }, 5000);

    setTimeout(() => {
      this.ordersService.updateOrderStatus(data.id, 'EM_ENTREGA');
      console.log(`Pedido ${data.id} atualizado para: EM_ENTREGA`);
    }, 10000);

    setTimeout(() => {
      this.ordersService.updateOrderStatus(data.id, 'ENTREGUE');
      console.log(`Pedido ${data.id} atualizado para: ENTREGUE`);
    }, 15000);
  }
}