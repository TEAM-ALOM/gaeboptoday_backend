import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import CreateUserDto from './user.dto';
import { User } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('사용자 API')
@Injectable()
@Controller('/user')
export class UserController {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly userservice: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성 API' })
  @ApiBody({
    description: '사용자 생성 정보 DTO',
    type: CreateUserDto,
  })
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.userservice.create(data);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 사용자 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '사용자 테이블에 저장되는 uuid',
  })
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userservice.getUser({ id: id });
  }

  @Get()
  @ApiOperation({ summary: '다중 사용자 조회 API' })
  async getUsers(): Promise<User[]> {
    return await this.userservice.getUsers();
  }
}
