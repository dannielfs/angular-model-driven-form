# Angular Model Driven Form

Biblioteca experimental de formulários dinâmicos para Angular Material. Os campos, validators e regras de visibilidade são declarados em um model TypeScript; a biblioteca cria o `FormGroup` e renderiza a interface.

## Recursos

- Angular Reactive Forms e Signals
- API baseada em decorators, sem `reflect-metadata`
- Saída tipada como uma instância do model
- Campos de texto, número, select, checkbox, data e textarea
- Validators do Angular e mensagens personalizadas
- Campos condicionais
- Layout responsivo sem dependência de Tailwind
- Testes com Vitest

## Estrutura

```text
projects/model-driven-form/  # biblioteca publicável
src/app/                    # aplicação de demonstração
```

O diretório `core` não importa Angular Material. A camada `material` é responsável apenas pela renderização.

## Exemplo

```ts
import { Validators } from '@angular/forms';
import { FormControlType, FormField } from 'model-driven-form';

export class RegistrationForm {
  @FormField({
    type: FormControlType.Text,
    label: 'Nome',
    validators: [Validators.required],
  })
  name = '';

  @FormField({
    type: FormControlType.Checkbox,
    label: 'Apenas remoto',
  })
  remoteOnly = false;

  @FormField<RegistrationForm>({
    type: FormControlType.Text,
    label: 'Cidade',
    visibleWhen: (value) => !value.remoteOnly,
  })
  city = '';
}
```

```html
<mdf-form [model]="RegistrationForm" (submitted)="save($event)" />
```

## Desenvolvimento

```bash
npm install
npm start
```

O comando compila a biblioteca e inicia a aplicação de demonstração em `http://localhost:4200`.

## Validação

```bash
npm run build
npm test
npm run format:check
```

## Publicação local

```bash
npm run build:library
```

O pacote é gerado em `dist/model-driven-form` no formato recomendado para bibliotecas Angular.

## Roadmap

- Registro de renderizadores personalizados
- Form arrays e grupos aninhados
- Validators assíncronos
- Autocomplete, chips e máscaras
- Internacionalização das mensagens padrão
- Schematic `ng add`
