import type { Encrypter } from '@/domain/account/application/cryptography/encrypter';
import { env } from '@repo/env';
import { type SignOptions, sign, verify } from 'jsonwebtoken';
import { injectable } from 'tsyringe';

@injectable()
export class JwtEncrypt implements Encrypter {
  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string,
  ): Promise<string> {
    return sign(payload, env.JWT_SECRET, {
      expiresIn: (expiresIn ?? '1d') as SignOptions['expiresIn'],
    });
  }

  async verify(token: string): Promise<string | Record<string, unknown>> {
    return verify(token, env.JWT_SECRET);
  }
}
