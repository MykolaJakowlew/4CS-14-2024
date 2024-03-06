import { Injectable } from '@nestjs/common';
import { LoginDto, UserDto } from '../models';
import { Model } from 'mongoose';
import { UserDoc, Users } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserDoesNotExists } from '../shared/errors';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    const isExists = await this.userModel.findOne({ login: body.login });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }

    /**
     * Validation
     */
    const doc = new this.userModel(body);

    /**
     * Save into DB
     */
    const user = await doc.save();

    return user;
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      login: body.login,
      password: body.password,
    });

    if (!user) {
      throw new UserDoesNotExists(
        `User with login ${body.login} was not found`,
      );
    }

    user.token = randomUUID();

    await user.save();

    return user.token;
  }

  async getAllUsers() {
    const users = await this.userModel.find(
      {},
      { password: false, token: false },
    );
    return users;
  }
}
