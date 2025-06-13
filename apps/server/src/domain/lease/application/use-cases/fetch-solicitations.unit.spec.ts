import 'reflect-metadata';
import { makeSolicitation } from '@/test/factories/make-solicitation';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchSolicitations } from './fetch-solicitations';

describe('Fetch solicitations use case', () => {
  let solicitationsRepository: InMemorySolicitationsRepository;
  let sut: FetchSolicitations;

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository();
    sut = new FetchSolicitations(solicitationsRepository);
  });

  it('should be able to fetch solicitations', async () => {
    await Promise.all([
      solicitationsRepository.create(makeSolicitation({}, 'solicitation-01')),
      solicitationsRepository.create(makeSolicitation({}, 'solicitation-02')),
      solicitationsRepository.create(makeSolicitation({}, 'solicitation-03')),
    ]);

    const result = await sut.execute();

    expect(result.isSuccess()).toBe(true);
    expect(solicitationsRepository.solicitations).toHaveLength(3);
    expect(result.value).toEqual({
      solicitations: expect.arrayContaining([
        expect.objectContaining({ id: 'solicitation-01' }),
        expect.objectContaining({ id: 'solicitation-02' }),
        expect.objectContaining({ id: 'solicitation-03' }),
      ]),
    });
  });
});
