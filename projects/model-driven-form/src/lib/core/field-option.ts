export interface FieldOption<T = unknown> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}
