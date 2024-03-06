import { Body, Controller, Post } from '@nestjs/common';
import { OrderDto } from '../models';
import { OrdersService } from '../services/orders.service';

@Controller({ path: '/orders' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(@Body() body: OrderDto) {
    const order = await this.ordersService.createOrder(body);

    return order;
  }
}
