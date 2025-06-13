import 'reflect-metadata';
import { makeSolicitation } from '@/test/factories/make-solicitation';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RefuseSolicitation } from './refuse-solicitation';

describe('Refuse solicitation use case', () => {
  let solicitationsRepository: InMemorySolicitationsRepository;
  let sut: RefuseSolicitation;

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository();
    sut = new RefuseSolicitation(solicitationsRepository);
  });

  it('should be able to refuse a solicitation', async () => {
    await solicitationsRepository.create(
      makeSolicitation({}, 'solicitation-01'),
    );

    const result = await sut.execute({ solicitationId: 'solicitation-01' });

    expect(result.isSuccess()).toBe(true);
    expect(solicitationsRepository.solicitations).toHaveLength(1);
    expect(solicitationsRepository.solicitations[0]?.status).toEqual(
      'REJECTED',
    );
  });

  it('should not be able to refuse a solicitation that does not exist', async () => {
    const result = await sut.execute({ solicitationId: 'solicitation-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to refuse a solicitation that has already been processed', async () => {
    await solicitationsRepository.create(
      makeSolicitation({ status: 'APPROVED' }, 'solicitation-01'),
    );

    const result = await sut.execute({ solicitationId: 'solicitation-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation already processed',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
