import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema, UserSchema, Users } from './schema';
import { OrdersController, UsersController } from './controllers';
import { UserAuthorizationMiddleware } from './middleware/userAuthorization.middleware';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mykola_2024:tfEsXsIfxkgNx6KG@cluster0.z33oori.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: '4CS-14' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
    ]),
  ],
  controllers: [UsersController, OrdersController],
  providers: [UsersService, OrdersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
  }
}
