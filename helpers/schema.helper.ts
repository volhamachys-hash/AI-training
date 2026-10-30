import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

/** Validates data against a JSON Schema; returns readable errors, empty when the data matches. */
export function validateSchema(schema: AnySchema, data: unknown): string[] {
  // ajv caches compiled validators by schema object, so compiling per call is cheap.
  const validate = ajv.compile(schema);
  if (validate(data)) {
    return [];
  }
  return (validate.errors ?? []).map((error) => `${error.instancePath || '(root)'} ${error.message}`);
}
