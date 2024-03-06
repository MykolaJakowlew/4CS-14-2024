import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Orders, OrdersDoc } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDto } from '../models';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name)
    private readonly ordersModel: Model<OrdersDoc>,
  ) {}

  async createOrder(order: OrderDto & { login: string }) {
    const price = 50;

    const doc = new this.ordersModel({ ...order, price });

    const newOrder = await doc.save();

    return newOrder;
  }
}
