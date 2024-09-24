import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './types/login.dto';
import { ResponseDto } from 'src/types/response.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtAccessGuard } from './guard/jwt-access.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Injectable()
@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly userservice: UserService,
  ) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({
    type: LoginDTO,
  })
  @ApiResponse({
    type: ResponseDto<{ message: 'login_success'; access_token: string }>,
  })
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() data: LoginDTO,
  ): Promise<ResponseDto<{ access_token: string }>> {
    const loginData = await this.authservice.login(data);
    if (!loginData) {
      throw new UnauthorizedException('login_failed');
    }
    const payload = {
      studentCode: loginData.studentCode,
      name: loginData.name,
      major: loginData.major,
    };

    const user = await this.userservice.getUser(loginData.studentCode);
    if (!user) {
      await this.userservice.create(payload);
    }

    const access_token = this.authservice.createAccessToken(payload);

    response.setHeader('authotization', 'Bearer ' + access_token);

    return ResponseDto.success('login_success', { access_token });
  }

  @Get('/login')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: '로그인 확인용 api',
  })
  @ApiBearerAuth('token')
  logincheck(@Req() req: any): ResponseDto<any> {
    if (req.user) {
      return ResponseDto.success('로그인 되어있습니다.', {
        user: req.user.name,
      });
    }
    return ResponseDto.success('로그인 되어있지 않습니다.');
  }
}
