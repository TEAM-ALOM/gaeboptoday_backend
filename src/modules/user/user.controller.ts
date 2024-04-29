import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import CreateUserDto from './user.dto';
import { User } from '@prisma/client';

@Injectable()
@Controller('/user')
export class UserController {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly userservice: UserService,
  ) {}

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.userservice.create(data);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userservice.getUser({ id: id });
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userservice.getUsers();
  }
}
