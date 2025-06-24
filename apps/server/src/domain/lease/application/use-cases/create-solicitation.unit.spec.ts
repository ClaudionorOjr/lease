import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service.ts';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { InMemorySolicitationsRepository } from '@/test/repositories/in-memory-solicitations-repository.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateSolicitation } from './create-solicitation.ts';

describe('Create solicitation use case', () => {
  let solicitationsRepository: InMemorySolicitationsRepository;
  let servicesRepository: InMemoryServicesRepository;
  let sut: CreateSolicitation;

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository();
    servicesRepository = new InMemoryServicesRepository();
    sut = new CreateSolicitation(solicitationsRepository, servicesRepository);
  });

  it('should be able to create a solicitation', async () => {
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
    });

    expect(result.isSuccess()).toBe(true);
    expect(solicitationsRepository.solicitations).toHaveLength(1);
    expect(solicitationsRepository.solicitations[0]).toMatchObject({
      id: expect.any(String),
      lessee: expect.any(String),
      cpf: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      description: expect.any(String),
      status: 'PENDING',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      createdAt: expect.any(Date),
    });
  });

  it('should not be ablet to create a solicitation with a non-existent service', async () => {
    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      serviceId: 'service-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Service not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to create a solicitation with the start date before today', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      serviceId: 'service-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Start date must be greater than today',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to create a solicitation with the end date before the start date', async () => {
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
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'End date must be greater than start date',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  //TODO Adicionar mais verificações de intervalo de datas
});
