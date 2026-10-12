import { ValidatorFn } from '@angular/forms';
import { FieldOption } from './field-option';
import { FormControlType } from './form-control-type';

export type FormValue = Record<string, unknown>;
export type FieldErrorMessages = Readonly<Record<string, string>>;

export interface FieldConfig<TModel extends object = FormValue> {
  readonly type: FormControlType;
  readonly label: string;
  readonly order?: number;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly inputType?: 'text' | 'email' | 'password' | 'tel' | 'url';
  readonly validators?: readonly ValidatorFn[];
  readonly errorMessages?: FieldErrorMessages;
  readonly options?: readonly FieldOption[];
  readonly rows?: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly columnSpan?: 1 | 2;
  readonly visibleWhen?: (value: Partial<TModel>) => boolean;
}

export interface ModelFormField<TModel extends object = FormValue> extends FieldConfig<TModel> {
  readonly key: string;
  readonly declarationOrder: number;
}
