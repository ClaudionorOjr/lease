import { Entity } from '@/core/entities/entity';

export interface ServiceProps {
  name: string;
  description?: string | null;
  priceInCents: number;
  createdBy: string;
}

export class Service extends Entity<ServiceProps> {
  /* GETTERS & SETTERS */
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string | null | undefined) {
    this.props.description = description;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }

  set priceInCents(priceInCents: number) {
    this.props.priceInCents = priceInCents;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  /* METHODS */
  public static create(props: ServiceProps, id?: string) {
    const service = new Service({ ...props }, id);

    return service;
  }
}
