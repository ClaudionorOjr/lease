import 'reflect-metadata';
import { makeSolicitation } from '@/test/factories/make-solicitation.ts';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetSolicitation } from './get-solicitation.ts';

describe('Get solicitation use case', () => {
  let solicitationsRepository: InMemorySolicitationsRepository;
  let sut: GetSolicitation;

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository();
    sut = new GetSolicitation(solicitationsRepository);
  });

  it('should be able to get a solicitation by id', async () => {
    await solicitationsRepository.create(
      makeSolicitation({}, 'solicitation-01'),
    );

    const result = await sut.execute({ solicitationId: 'solicitation-01' });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      solicitation: expect.objectContaining({ id: 'solicitation-01' }),
    });
  });

  it('should not be able to get a solicitation that does not exist', async () => {
    const result = await sut.execute({ solicitationId: 'solicitation-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
