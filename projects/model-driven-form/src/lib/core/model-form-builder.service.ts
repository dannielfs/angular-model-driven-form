import { Service } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getModelFormFields } from './form-field.decorator';
import {
  DynamicControls,
  DynamicFormGroup,
  ModelConstructor,
  ModelFormDefinition
} from './model-form.types';

@Service()
export class ModelFormBuilder {
  build<T extends object>(modelType: ModelConstructor<T>, initialValue?: Partial<T> | null): ModelFormDefinition<T> {
    const model = Object.assign(new modelType(), initialValue ?? {});
    const fields = getModelFormFields<T>(modelType.prototype as object);
    const controls: DynamicControls = {};
    
    for ( const field of fields ) {
      const value = model[field.key as keyof T] ?? null;
      controls[field.key] = new FormControl(
        { value, disabled: field.disabled ?? false },
        { validators: [ ...(field.validators ?? []) ] }
      );
    }
    
    return {
      fields,
      form: new FormGroup<DynamicControls>(controls) as DynamicFormGroup,
      model
    };
  }
  
  toModel<T extends object>(modelType: ModelConstructor<T>, value: Partial<T>): T {
    return Object.assign(new modelType(), value);
  }
}
