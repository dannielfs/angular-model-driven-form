# model-driven-form

Formulários dinâmicos para Angular Material gerados a partir de models TypeScript decorados.

## Uso rápido

```ts
import { Validators } from '@angular/forms';
import { FormControlType, FormField } from 'model-driven-form';

export class ContactForm {
  @FormField({
    type: FormControlType.Text,
    label: 'E-mail',
    inputType: 'email',
    validators: [Validators.required, Validators.email],
  })
  email = '';
}
```

```ts
import { ModelDrivenFormComponent } from 'model-driven-form';

@Component({
  imports: [ModelDrivenFormComponent],
  template: ` <mdf-form [model]="ContactForm" (submitted)="save($event)" /> `,
})
export class ExampleComponent {
  readonly ContactForm = ContactForm;

  save(value: ContactForm): void {
    console.log(value);
  }
}
```

O pacote requer Angular, Angular Forms, Angular Material e Angular CDK como peer dependencies.
