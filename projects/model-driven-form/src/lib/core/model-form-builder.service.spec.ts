import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { FormControlType } from './form-control-type';
import { FormField } from './form-field.decorator';
import { ModelFormBuilder } from './model-form-builder.service';

class SettingsForm {
  @FormField({
    type: FormControlType.Text,
    label: 'Nome',
    validators: [Validators.required],
  })
  name = '';

  @FormField({ type: FormControlType.Number, label: 'Quantidade' })
  quantity = 0;

  @FormField({ type: FormControlType.Checkbox, label: 'Ativo' })
  active = false;
}

describe('ModelFormBuilder', () => {
  let builder: ModelFormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    builder = TestBed.inject(ModelFormBuilder);
  });

  it('preserva valores false e zero do model', () => {
    const definition = builder.build(SettingsForm);

    expect(definition.form.controls['quantity'].value).toBe(0);
    expect(definition.form.controls['active'].value).toBe(false);
  });

  it('aplica valor inicial e validators', () => {
    const definition = builder.build(SettingsForm, { name: 'Ada', quantity: 3 });

    expect(definition.form.getRawValue()).toMatchObject({
      name: 'Ada',
      quantity: 3,
      active: false,
    });
    definition.form.controls['name'].setValue('');
    expect(definition.form.controls['name'].hasError('required')).toBe(true);
  });

  it('converte o resultado em uma instância do model', () => {
    const value = builder.toModel(SettingsForm, { name: 'Grace' });

    expect(value).toBeInstanceOf(SettingsForm);
    expect(value.name).toBe('Grace');
  });
});
