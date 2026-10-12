import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { FormControlType } from '../core/form-control-type';
import { FormField } from '../core/form-field.decorator';
import { DynamicFormGroup } from '../core/model-form.types';
import { ModelDrivenFormComponent } from './model-driven-form.component';

class ProfileForm {
  @FormField({
    type: FormControlType.Text,
    label: 'Nome',
    validators: [Validators.required],
  })
  name = '';

  @FormField({ type: FormControlType.Checkbox, label: 'Trabalho remoto' })
  remote = false;

  @FormField<ProfileForm>({
    type: FormControlType.Text,
    label: 'Cidade',
    visibleWhen: (value) => !value.remote,
  })
  city = '';
}

describe('ModelDrivenFormComponent', () => {
  it('renderiza os campos declarados no model', async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDrivenFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModelDrivenFormComponent<ProfileForm>);
    fixture.componentRef.setInput('model', ProfileForm);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nome');
    expect(fixture.nativeElement.textContent).toContain('Trabalho remoto');
    expect(fixture.nativeElement.textContent).toContain('Cidade');
  });

  it('omite campos quando a condição de visibilidade não é atendida', async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDrivenFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModelDrivenFormComponent<ProfileForm>);
    fixture.componentRef.setInput('model', ProfileForm);
    fixture.componentRef.setInput('initialValue', { remote: true });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).not.toContain('Cidade');
  });

  it('reage a alterações que mudam a visibilidade dos campos', async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDrivenFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModelDrivenFormComponent<ProfileForm>);
    fixture.componentRef.setInput('model', ProfileForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as {
      form: () => DynamicFormGroup;
    };
    component.form().controls['remote'].setValue(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Cidade');
    expect(component.form().controls['city'].disabled).toBe(true);
  });

  it('não envia um formulário inválido', async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDrivenFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModelDrivenFormComponent<ProfileForm>);
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentRef.setInput('model', ProfileForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submitted).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Campo obrigatório.');
  });

  it('emite uma instância tipada quando o formulário é válido', async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDrivenFormComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModelDrivenFormComponent<ProfileForm>);
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentRef.setInput('model', ProfileForm);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as {
      form: () => DynamicFormGroup;
    };
    component.form().controls['name'].setValue('Ada Lovelace');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(submitted).toHaveBeenCalledOnce();
    expect(submitted.mock.calls[0][0]).toBeInstanceOf(ProfileForm);
    expect(submitted.mock.calls[0][0].name).toBe('Ada Lovelace');
  });
});
