import { Entity } from '@/core/entities/entity';
import type { Optional } from '@/core/types/optional';

export type SolicitationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SolicitationProps {
  lessee: string;
  cpf: string;
  email?: string | null;
  phone: string;
  description?: string | null;
  status: SolicitationStatus;
  startDate: Date;
  endDate: Date;
  serviceId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Solicitation extends Entity<SolicitationProps> {
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

  set email(email: string | undefined | null) {
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

  set description(description: string | undefined | null) {
    this.props.description = description;
    this.touch();
  }

  get status() {
    return this.props.status;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  /* METHODS */
  public approve() {
    this.props.status = 'APPROVED';
    this.touch();
  }

  public reject() {
    this.props.status = 'REJECTED';
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<SolicitationProps, 'status' | 'createdAt'>,
    id?: string,
  ) {
    const solicitation = new Solicitation(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return solicitation;
  }
}
