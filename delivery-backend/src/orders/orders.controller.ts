import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { customerName: string; item: string }) {
    return this.ordersService.createOrder(body.customerName, body.item);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}