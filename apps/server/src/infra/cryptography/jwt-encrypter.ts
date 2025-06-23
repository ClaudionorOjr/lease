import type { Encrypter } from '@/domain/account/application/cryptography/encrypter.ts';
import { env } from '@repo/env';
import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

@injectable()
export class JwtEncrypt implements Encrypter {
  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string,
  ): Promise<string> {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: (expiresIn ?? '1d') as jwt.SignOptions['expiresIn'],
    });
  }

  async verify(token: string): Promise<string | Record<string, unknown>> {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
