import 'reflect-metadata';
import { makeLease } from '@/test/factories/make-lease';
import { makeService } from '@/test/factories/make-service';
import { InMemoryLeasesRepository } from '@/test/repositories/in-memory-leases-repository';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { add, sub } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateLease } from './create-lease';

describe('Create lease use case', () => {
  let leasesRepository: InMemoryLeasesRepository;
  let servicesRepository: InMemoryServicesRepository;
  let solicitationsRepository: InMemorySolicitationsRepository;
  let sut: CreateLease;

  beforeEach(() => {
    leasesRepository = new InMemoryLeasesRepository();
    servicesRepository = new InMemoryServicesRepository();
    solicitationsRepository = new InMemorySolicitationsRepository();
    sut = new CreateLease(
      leasesRepository,
      servicesRepository,
      solicitationsRepository,
    );
  });

  it('should be able to create a lease', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: new Date(),
      endDate: faker.date.future(),
      serviceId: 'service-01',
      createdBy: faker.string.uuid(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(leasesRepository.leases).toHaveLength(1);
    expect(leasesRepository.leases[0]).toMatchObject({
      id: expect.any(String),
      lessee: expect.any(String),
      cpf: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      description: expect.any(String),
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      createdAt: expect.any(Date),
    });
  });

  it('should not be able to create a lease with a non-existent solicitation', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.recent({ days: 3 }),
      endDate: faker.date.future(),
      serviceId: 'service-01',
      solicitationId: faker.string.uuid(),
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Solicitation not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to create a lease with a non-existent service', async () => {
    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.recent({ days: 3 }),
      endDate: faker.date.future(),
      serviceId: faker.string.uuid(),
      solicitationId: faker.string.uuid(),
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Service not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  // TODO Criar testes para diferentes intervalos de busca
  it('should not be able to create a lease with a overlapping date range', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const today = new Date();

    await leasesRepository.create(
      makeLease({
        startDate: today,
        endDate: add(today, { days: 3 }),
      }),
    );

    /* Same dates */
    // const startDate = today;
    // const endDate = add(today, { days: 3 });

    /* Same start date */
    // const startDate = today;
    // const endDate = add(today, { days: 2 });

    /* Start date equals another end date */
    // const startDate = add(today, { days: 3 });
    // const endDate = add(today, { days: 3 });

    /* Within range */
    const startDate = sub(today, { days: 1 });
    const endDate = add(today, { days: 5 });

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate,
      endDate,
      serviceId: 'service-01',
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Lease already exists in date range',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to create a lease with the start date before today', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: sub(new Date(), { days: 1 }),
      endDate: faker.date.future(),
      serviceId: 'service-01',
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Start date must be greater than today',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to create a lease with the end date before the start date', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.future(),
      endDate: faker.date.recent(),
      serviceId: 'service-01',
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'End date must be greater than start date',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
