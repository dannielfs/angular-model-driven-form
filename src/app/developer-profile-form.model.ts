import { Validators } from '@angular/forms';
import { FormControlType, FormField } from 'model-driven-form';

export class DeveloperProfileForm {
  @FormField({
    type: FormControlType.Text,
    label: 'Nome completo',
    placeholder: 'Como devemos chamar você?',
    inputType: 'text',
    validators: [Validators.required, Validators.minLength(3)],
    errorMessages: {
      required: 'Informe seu nome.',
      minlength: 'O nome precisa ter pelo menos 3 caracteres.',
    },
    columnSpan: 2,
  })
  fullName = '';

  @FormField({
    type: FormControlType.Text,
    label: 'E-mail',
    placeholder: 'voce@exemplo.com',
    inputType: 'email',
    validators: [Validators.required, Validators.email],
  })
  email = '';

  @FormField({
    type: FormControlType.Number,
    label: 'Anos de experiência',
    min: 0,
    max: 50,
    validators: [Validators.required, Validators.min(0), Validators.max(50)],
  })
  experienceYears = 0;

  @FormField({
    type: FormControlType.Select,
    label: 'Área principal',
    placeholder: 'Selecione uma área',
    options: [
      { label: 'Frontend', value: 'frontend' },
      { label: 'Backend', value: 'backend' },
      { label: 'Full stack', value: 'fullstack' },
      { label: 'Mobile', value: 'mobile' },
    ],
    validators: [Validators.required],
  })
  primaryArea = '';

  @FormField({
    type: FormControlType.Date,
    label: 'Disponível a partir de',
    hint: 'Você poderá alterar esta data depois.',
  })
  availableFrom: Date | null = null;

  @FormField({
    type: FormControlType.Checkbox,
    label: 'Procuro apenas oportunidades remotas',
    hint: 'Ao marcar, o campo de cidade deixa de ser necessário.',
    columnSpan: 2,
  })
  remoteOnly = false;

  @FormField<DeveloperProfileForm>({
    type: FormControlType.Text,
    label: 'Cidade',
    placeholder: 'Ex.: Belo Horizonte',
    validators: [Validators.required],
    visibleWhen: (value) => !value.remoteOnly,
    columnSpan: 2,
  })
  city = '';

  @FormField({
    type: FormControlType.Textarea,
    label: 'Sobre você',
    placeholder: 'Conte brevemente sobre sua experiência e seus objetivos.',
    rows: 5,
    validators: [Validators.required, Validators.maxLength(500)],
    hint: 'Máximo de 500 caracteres.',
    columnSpan: 2,
  })
  bio = '';
}
