import { Entity } from '@/core/entities/entity.ts';
import type { Optional } from '@/core/types/optional.ts';

export interface LeaseProps {
  lessee: string;
  cpf: string;
  email?: string | null;
  phone: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  serviceId: string;
  leasingPriceInCents: number;
  solicitationId?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date | null;
  canceledAt?: Date | null;
}

export class Lease extends Entity<LeaseProps> {
  /* GETTERS & SETTERS */
  get lessee() {
    return this.props.lessee;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string | null | undefined) {
    this.props.email = email;
    this.touch();
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string | null | undefined) {
    this.props.description = description;
    this.touch();
  }

  get startDate() {
    return this.props.startDate;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
    this.touch();
  }

  get endDate() {
    return this.props.endDate;
  }

  set endDate(endDate: Date) {
    this.props.endDate = endDate;
    this.touch();
  }

  get serviceId() {
    return this.props.serviceId;
  }

  set serviceId(serviceId: string) {
    this.props.serviceId = serviceId;
    this.touch();
  }

  get leasingPriceInCents() {
    return this.props.leasingPriceInCents;
  }

  set leasingPriceInCents(leasingPriceInCents: number) {
    this.props.leasingPriceInCents = leasingPriceInCents;
    this.touch();
  }

  get solicitationId() {
    return this.props.solicitationId;
  }

  set solicitationId(solicitationId: string | null | undefined) {
    this.props.solicitationId = solicitationId;
    this.touch();
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get canceledAt() {
    return this.props.canceledAt;
  }

  /* METHODS */

  public cancel() {
    this.props.canceledAt = new Date();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public static create(props: Optional<LeaseProps, 'createdAt'>, id?: string) {
    const lease = new Lease(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return lease;
  }
}
