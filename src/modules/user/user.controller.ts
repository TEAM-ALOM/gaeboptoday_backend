import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Response,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';

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
  @ApiResponse({
    type: ResponseDto<User>,
  })
  async createUser(@Body() data: CreateUserDto): Promise<ResponseDto<User>> {
    const result = await this.userservice.create(data);
    return ResponseDto.created('create_success', result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '단일 사용자 조회 API' })
  @ApiParam({
    name: 'id',
    type: String,
    description: '사용자 테이블에 저장되는 uuid',
  })
  @ApiResponse({
    type: ResponseDto<User>,
  })
  async getUser(@Param('id') id: string): Promise<ResponseDto<User>> {
    const result = await this.userservice.getUser(id);
    return ResponseDto.success('inquiry_success', result);
  }

  @Get()
  @ApiOperation({ summary: '다중 사용자 조회 API' })
  @ApiResponse({
    type: ResponseDto<User[]>,
  })
  async getUsers(): Promise<ResponseDto<User[]>> {
    const result = await this.userservice.getUsers();
    return ResponseDto.success('inquiry_success', result);
  }
}
