import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './user.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaservice: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prismaservice.user.create({ data });
  }

  async getUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return await this.prismaservice.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getUsers(parmas?: {
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return await this.prismaservice.user.findMany(parmas);
  }
}
