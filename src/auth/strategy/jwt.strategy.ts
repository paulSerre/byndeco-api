import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { cookieExtractor } from '../utils/cookieExtractor';
import { Roles } from 'src/users/dto/roles.enum';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/constants';

type JwtPayload = {
  sub: string;
  roles: Roles[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor(ACCESS_TOKEN_COOKIE_NAME),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      roles: payload.roles,
    };
  }
}
