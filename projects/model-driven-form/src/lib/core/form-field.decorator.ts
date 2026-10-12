import { FieldConfig, ModelFormField } from './field-config';

interface RegisteredField {
  readonly key: string;
  readonly config: FieldConfig<object>;
  readonly declarationOrder: number;
}

const fieldRegistry = new WeakMap<object, RegisteredField[]>();

export function FormField<TModel extends object = Record<string, unknown>>(config: FieldConfig<TModel>): PropertyDecorator {

  return (target: object, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const registered = fieldRegistry.get(target) ?? [];
    const existingIndex = registered.findIndex((field) => field.key === key);
    const field: RegisteredField = {
      key,
      config: config as FieldConfig<object>,
      declarationOrder:
        existingIndex >= 0 ? registered[existingIndex].declarationOrder : registered.length,
    };

    if (existingIndex >= 0) {
      registered[existingIndex] = field;
    } else {
      registered.push(field);
    }

    fieldRegistry.set(target, registered);
  };

}

export function getModelFormFields<TModel extends object>(modelPrototype: object): readonly ModelFormField<TModel>[] {
  const prototypes: object[] = [];
  let current: object | null = modelPrototype;

  while (current && current !== Object.prototype) {
    prototypes.unshift(current);
    current = Object.getPrototypeOf(current) as object | null;
  }

  const merged = new Map<string, RegisteredField>();
  let declarationOrder = 0;

  for (const prototype of prototypes) {
    for (const field of fieldRegistry.get(prototype) ?? []) {
      merged.set(field.key, { ...field, declarationOrder });
      declarationOrder += 1;
    }
  }

  return Array.from(merged.values())
    .map((field) => ({
      ...field.config,
      key: field.key,
      declarationOrder: field.declarationOrder,
    }))
    .sort(
      (left, right) =>
        (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER) ||
        left.declarationOrder - right.declarationOrder,
    ) as readonly ModelFormField<TModel>[];
}
