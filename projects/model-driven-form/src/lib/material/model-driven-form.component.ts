import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ModelFormField } from '../core/field-config';
import { FormControlType } from '../core/form-control-type';
import { ModelFormBuilder } from '../core/model-form-builder.service';
import { DynamicFormGroup, ModelConstructor } from '../core/model-form.types';

@Component({
  selector: 'mdf-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './model-driven-form.component.html',
  styleUrl: './model-driven-form.component.scss',
})
export class ModelDrivenFormComponent<T extends object = Record<string, unknown>> {
  readonly modelType = input.required<ModelConstructor<T>>({ alias: 'model' });
  readonly initialValue = input<Partial<T> | null>(null);
  readonly submitLabel = input('Salvar');
  readonly showReset = input(true);

  readonly submitted = output<T>();
  readonly valueChange = output<Partial<T>>();

  protected readonly controlType = FormControlType;
  protected readonly fields = signal<readonly ModelFormField<T>[]>([]);
  protected readonly form = signal<DynamicFormGroup>(new FormGroup({}) as DynamicFormGroup);
  protected readonly formValue = signal<Partial<T>>({});
  protected readonly visibleFields = computed(() =>
    this.fields().filter((field) => field.visibleWhen?.(this.formValue()) ?? true),
  );

  private readonly builder = inject(ModelFormBuilder);
  private initialSnapshot: Partial<T> = {};

  constructor() {
    effect((onCleanup) => {
      const modelType = this.modelType();
      const definition = this.builder.build(modelType, this.initialValue());
      const initialValue = definition.form.getRawValue() as Partial<T>;

      this.initialSnapshot = initialValue;
      this.fields.set(definition.fields);
      this.form.set(definition.form);
      this.formValue.set(initialValue);
      this.updateFieldVisibility();

      const subscription = definition.form.valueChanges.subscribe(() => {
        const value = definition.form.getRawValue() as Partial<T>;
        this.formValue.set(value);
        this.updateFieldVisibility();
        this.valueChange.emit(value);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected controlFor(field: ModelFormField<T>): FormControl<unknown> {
    return this.form().controls[field.key];
  }

  protected errorFor(field: ModelFormField<T>): string {
    const control = this.controlFor(field);
    const errorKey = Object.keys(control.errors ?? {})[0];

    if (!errorKey) return '';
    if (field.errorMessages?.[errorKey]) {
      return field.errorMessages[errorKey];
    }

    const error = control.getError(errorKey) as Record<string, unknown> | null;
    const defaultMessages: Record<string, string> = {
      required: 'Campo obrigatório.',
      email: 'Informe um e-mail válido.',
      min: `O valor mínimo é ${String(error?.['min'] ?? field.min ?? '')}.`,
      max: `O valor máximo é ${String(error?.['max'] ?? field.max ?? '')}.`,
      minlength: `Digite pelo menos ${String(error?.['requiredLength'] ?? '')} caracteres.`,
      maxlength: `Digite no máximo ${String(error?.['requiredLength'] ?? '')} caracteres.`,
      pattern: 'O valor informado não possui o formato esperado.',
    };

    return defaultMessages[errorKey] ?? 'Valor inválido.';
  }

  protected submit(): void {
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.builder.toModel(this.modelType(), form.getRawValue() as Partial<T>));
  }

  protected reset(): void {
    this.form().reset(this.initialSnapshot);
    this.formValue.set(this.initialSnapshot);
    this.updateFieldVisibility();
  }

  private updateFieldVisibility(): void {
    const form = this.form();
    const currentValue = form.getRawValue() as Partial<T>;

    for (const field of this.fields()) {
      const control = form.controls[field.key];
      const visible = field.visibleWhen?.(currentValue) ?? true;
      const shouldBeDisabled = !visible || (field.disabled ?? false);

      if (shouldBeDisabled && control.enabled) {
        control.disable({ emitEvent: false });
      } else if (!shouldBeDisabled && control.disabled) {
        control.enable({ emitEvent: false });
      }
    }
  }
}
