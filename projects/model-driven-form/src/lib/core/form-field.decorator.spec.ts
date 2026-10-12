import { Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { FieldConfig } from './field-config';
import { FormControlType } from './form-control-type';
import { FormField, getModelFormFields } from './form-field.decorator';

class BaseForm {
  @FormField({ type: FormControlType.Text, label: 'Identificador' })
  id = '';
}

class ExampleForm extends BaseForm {
  @FormField({
    type: FormControlType.Text,
    label: 'Nome',
    order: 2,
    validators: [Validators.required],
  })
  name = '';

  @FormField({ type: FormControlType.Number, label: 'Idade', order: 1 })
  age = 0;
}

describe('FormField', () => {
  it('registra campos herdados e respeita a ordem configurada', () => {
    const fields = getModelFormFields<ExampleForm>(ExampleForm.prototype);

    expect(fields.map((field) => field.key)).toEqual(['age', 'name', 'id']);
    expect(fields[1].validators).toHaveLength(1);
  });

  it('mantém a configuração do campo sem depender de reflect-metadata', () => {
    const field = getModelFormFields<ExampleForm>(ExampleForm.prototype).find(
      (item) => item.key === 'name',
    ) as FieldConfig<ExampleForm>;

    expect(field.label).toBe('Nome');
    expect(field.type).toBe(FormControlType.Text);
  });
});
