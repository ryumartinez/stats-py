// ../_utils/csv-utils.ts
import { parse } from 'csv-parse/sync';

/** How to parse one output field from the CSV. */
export type FieldSpec<T> = {
  /** CSV header to read from (defaults to the schema key). */
  from?: string;
  /** If true, CSV must include this header and the parsed value must be valid. */
  required?: boolean;
  /** Turn raw string into the desired type. Return null if invalid/unusable. */
  parse: (raw: string) => T | null;
  /** Fallback used when parse returns null and field is not required. */
  default?: T;
};

/** Infer output row type from a schema. */
export type InferRow<S extends Record<string, FieldSpec<unknown>>> = {
  [K in keyof S]: NonNullable<ReturnType<S[K]['parse']>>;
};

export type ParseCsvSuccess<R> = { ok: true; rows: R[]; warnings: string[] };
export type ParseCsvFailure = { ok: false; errors: string[]; warnings: string[] };
export type ParseCsvResult<R> = ParseCsvSuccess<R> | ParseCsvFailure;

/** Small wrapper around csv-parse (ESLint-friendly). */
const parseCsvObjects = (text: string): Record<string, string>[] => {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as unknown as Record<string, string>[];
};

const getHeaders = (records: Record<string, string>[]): readonly string[] =>
  records.length ? (Object.keys(records[0]!) as readonly string[]) : ([] as const);

/**
 * Generic, strictly-typed CSV parser driven by a schema.
 * - Validates required headers
 * - Parses every field with your `parse` function
 * - Applies defaults for optional fields
 * - Skips rows that fail required fields
 */
export function parseCsvWithSchema<S extends Record<string, FieldSpec<unknown>>>(
  text: string,
  schema: S
): ParseCsvResult<InferRow<S>> {
  const records = parseCsvObjects(text);
  const headers = getHeaders(records);

  const requiredHeaders = (Object.keys(schema) as Array<keyof S>)
    .filter((k) => schema[k]!.required)
    .map((k) => schema[k]!.from ?? (k as string));

  const missing = requiredHeaders.filter((h) => !headers.includes(h));
  const warnings: string[] = [];
  const errors: string[] = [];

  if (missing.length) {
    errors.push(`Missing required header(s): ${missing.join(', ')}`);
    return { ok: false, errors, warnings };
  }

  const rows: InferRow<S>[] = [];

  records.forEach((record, idx) => {
    const out = {} as InferRow<S>;
    let rowValid = true;
    const rowWarnings: string[] = [];

    (Object.keys(schema) as Array<keyof S>).forEach((k) => {
      const spec = schema[k];
      const src = spec!.from ?? (k as string);
      const raw = record[src] ?? '';

      const parsed = spec!.parse(raw);
      if (parsed == null) {
        if (spec!.required) {
          rowValid = false;
          rowWarnings.push(
            `Row ${idx + 1}: required "${String(k)}" from "${src}" is invalid/empty`
          );
        } else if ('default' in spec!) {
          (out as Record<string, unknown>)[k as string] = spec.default as NonNullable<
            ReturnType<(typeof spec)['parse']>
          >;
        } else {
          // choose to skip the row if optional value missing and no default
          rowValid = false;
          rowWarnings.push(
            `Row ${idx + 1}: optional "${String(k)}" missing and no default`
          );
        }
      } else {
        (out as Record<string, unknown>)[k as string] = parsed as NonNullable<
          ReturnType<(typeof spec)['parse']>
        >;
      }
    });

    if (rowValid) rows.push(out);
    warnings.push(...rowWarnings);
  });

  if (rows.length === 0) {
    errors.push('No valid data rows found.');
    return { ok: false, errors, warnings };
  }

  return { ok: true, rows, warnings };
}

/* ---------- Generic helper parsers (optional) ---------- */

/** Make YYYY-MM-DD from common date inputs; null if invalid. */
export const parseYyyyMmDd = (input: string): string | null => {
  const v = input.trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Permissive number parser (handles commas, spaces). */
export const parseNumberLoose = (raw: string): number | null => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};
