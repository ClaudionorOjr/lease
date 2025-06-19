import type { Hasher } from '@/domain/account/application/cryptography/hasher';
import { compare, hash } from 'bcrypt';

export class BcryptHasher implements Hasher {
  private HASH_SALT_LENGTH = 10;

  /**
   * Generates a hash of the given plain text string.
   *
   * @param {string} plain - The plain text string to be hashed.
   * @return {Promise<string>} - A promise that resolves to the hashed string.
   */
  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  /**
   * Compares a plain text string with a hashed string and returns a promise
   * that resolves to a boolean indicating whether they match.
   *
   * @param {string} plain - The plain text string to compare.
   * @param {string} hash - The hashed string to compare against.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating
   * whether the plain text and hashed string match.
   */
  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
