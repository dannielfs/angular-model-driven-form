import { FormControl, FormGroup } from '@angular/forms';
import { ModelFormField } from './field-config';

export type ModelConstructor<T extends object> = new () => T;
export type DynamicControls = Record<string, FormControl<unknown>>;
export type DynamicFormGroup = FormGroup<DynamicControls>;

export interface ModelFormDefinition<T extends object> {
  readonly fields: readonly ModelFormField<T>[];
  readonly form: DynamicFormGroup;
  readonly model: T;
}
