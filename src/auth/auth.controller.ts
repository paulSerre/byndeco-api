/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-auth.guard';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './utils/constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Express.Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(authDto);
    // @ts-ignore
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
    // @ts-ignore
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      path: '/auth/refresh',
    });
    return;
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDTO) {
    return this.authService.signUp(createUserDto);
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Express.Request,
    @Res({ passthrough: true }) response: Express.Response,
  ) {
    // @ts-ignore
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    // @ts-ignore
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      path: '/auth/refresh',
    });
    await this.authService.logout(req.user['userId']);
    return;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refreshTokens(
    @Req() req: Express.Request,
    @Res({ passthrough: true }) response: Express.Response,
  ) {
    // @ts-ignore
    const userId = req.user['userId'];
    // @ts-ignore
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(userId, refreshToken);
    // @ts-ignore
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
    // @ts-ignore
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
      path: '/auth/refresh',
    });
    return;
  }
}
