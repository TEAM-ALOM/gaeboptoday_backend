import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './types/login.dto';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import sejongAuthDelegator, { AuthDelegator, LoginRequestDto, ProfileResponseDto } from '@coffee-tree/sejong-auth-delegator';
import { AccessTokenPayload } from './types/access-token.payload';

export class AuthService {
  private authDelegator: AuthDelegator;
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(UserService)
    private readonly userservice: UserService,
  ) {
    this.authDelegator = sejongAuthDelegator();
  }

  createAccessToken(data: AccessTokenPayload): string {
    const accessToken = this.jwtservice.sign(data);
    return accessToken;
  }

  async login(user: LoginDTO): Promise<ProfileResponseDto> {
    const loginRequestDto = this.authDelegator.createLoginRequestDto(
      user.id,
      user.password,
    );

    try {
      const result = await this.authDelegator.getUserProfile(loginRequestDto);
      return result;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e);
    }
  }

  verifyToken(token: string): any {
    try {
      return this.jwtservice.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async verifyUser(data: LoginDTO): Promise<User | null> {
    const user = await this.userservice.getUser(data.id);
    if (!user) {
      throw new BadRequestException('아이디가 틀립니다!');
    }
    if (user) {
      return user;
    }
  }
}
