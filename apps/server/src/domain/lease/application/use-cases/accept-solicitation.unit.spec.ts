import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service.ts';
import { makeSolicitation } from '@/test/factories/make-solicitation.ts';
import { InMemoryLeasesRepository } from '@/test/repositories/in-memory-leases-repository.ts';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository.ts';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { AcceptSolicitation } from './accept-solicitation.ts';
import { CreateLease } from './create-lease.ts';

describe('Accept solicitation use case', () => {
  let leasesRepository: InMemoryLeasesRepository;
  let createLease: CreateLease;
  let solicitationsRepository: InMemorySolicitationsRepository;
  let servicesRepository: InMemoryServicesRepository;
  let sut: AcceptSolicitation;

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository();
    servicesRepository = new InMemoryServicesRepository();
    leasesRepository = new InMemoryLeasesRepository();
    createLease = new CreateLease(
      leasesRepository,
      servicesRepository,
      solicitationsRepository,
    );
    sut = new AcceptSolicitation(solicitationsRepository, createLease);
  });

  it('should be able to accept a solicitation', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    await solicitationsRepository.create(
      makeSolicitation({ serviceId: 'service-01' }, 'solicitation-01'),
    );

    const result = await sut.execute({
      userId: 'user-01',
      solicitationId: 'solicitation-01',
    });

    expect(result.isSuccess()).toBe(true);
    expect(solicitationsRepository.solicitations[0]).toMatchObject({
      status: 'APPROVED',
    });
    expect(leasesRepository.leases).toHaveLength(1);
    expect(leasesRepository.leases[0]).toMatchObject({
      solicitationId: 'solicitation-01',
    });
  });

  it('should not be able to accept a solicitation that does not exist', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      solicitationId: 'solicitation-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation not found',
    });
  });

  it('should not be able to accept a solicitation that has already been processed', async () => {
    await solicitationsRepository.create(
      makeSolicitation({ status: 'APPROVED' }, 'solicitation-01'),
    );

    const result = await sut.execute({
      userId: 'user-01',
      solicitationId: 'solicitation-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation already processed',
    });
    expect(result.value).instanceOf(Error);
  });
});
