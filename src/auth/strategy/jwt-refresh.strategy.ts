import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { cookieExtractor } from '../utils/cookieExtractor';
import { REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor(REFRESH_TOKEN_COOKIE_NAME),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return {
      userId: payload.sub,
      roles: payload.roles,
    };
  }
}
