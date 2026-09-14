import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export interface Order {
  id: string;
  customerName: string;
  item: string;
  status: 'CRIADO' | 'EM_PREPARO' | 'EM_ENTREGA' | 'ENTREGUE';
  createdAt: Date;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private orders: Order[] = [];

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  createOrder(customerName: string, item: string): Order {
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      customerName,
      item,
      status: 'CRIADO',
      createdAt: new Date(),
    };

    this.orders.push(newOrder);

    // Dispara o evento para o Kafka
    this.kafkaClient.emit('order.created', newOrder);

    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }
}