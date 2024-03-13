import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderDto } from '../models';
import { OrdersService } from '../services/orders.service';
import { UserLeanDoc } from '../schema';

@Controller({ path: '/orders' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    const { user } = req;

    const order = await this.ordersService.createOrder({
      ...body,
      login: user.login,
    });

    return order;
  }
}
