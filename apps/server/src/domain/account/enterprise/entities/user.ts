import { Entity } from '@/core/entities/entity';
import type { Optional } from '@/core/types/optional';

export interface UserProps {
  fullname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  /* GETTERS & SETTERS */
  get fullname() {
    return this.props.fullname;
  }

  set fullname(fullname: string) {
    this.props.fullname = fullname;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  /* METHODS */
  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
