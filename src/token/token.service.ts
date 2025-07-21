import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
export default class tokenService {
  constructor() {}
  signToken(userId: number): { access_token: string } {
    const payload = {
      sub: userId,
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const access_token = jwt.sign(payload, secret, {
      expiresIn: '15m',
    });

    return {
      access_token: access_token,
    };
  }

  signRefreshToken(userId: number): { refresh_token: string; exp: number } {
    const payload = {
      sub: userId,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const refresh_token = jwt.sign(payload, secret, {
      expiresIn: '7d',
    });

    const decoded = jwt.verify(refresh_token, secret) as jwt.JwtPayload;

    return {
      refresh_token: refresh_token,
      exp: Number(decoded.exp),
    };
  }
}
