'use client';

import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  type DragEvent,
  type ChangeEvent,
  type JSX,
} from "react";
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ColDefField,
  type ValueParserParams,
  type ValueFormatterParams,
  type CellValueChangedEvent,
} from 'ag-grid-community';

import {
  parseCsvWithSchema,
  type FieldSpec,
  type InferRow,
  parseYyyyMmDd,
  parseNumberLoose,
} from '../_utils/csv-utils';

// AG Grid (v34+) module registration
ModuleRegistry.registerModules([AllCommunityModule]);

/* ------------------------------
   Column helpers (typed)
------------------------------ */

function numberParser<R extends object>(p: ValueParserParams<R, number>): number {
  const n = Number(p.newValue);
  return Number.isFinite(n) ? n : 0;
}

function numberFormatter<R extends object>(p: ValueFormatterParams<R, number>): string {
  return typeof p.value === 'number'
    ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '';
}

function dateFormatter<R extends object>(p: ValueFormatterParams<R, string>): string {
  const value = p.value ?? '';
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function dateParser<R extends object>(p: ValueParserParams<R, string>): string {
  const val = String(p.newValue ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return p.oldValue ?? '';
}

// keep key types when iterating
function keysOf<T extends object>(o: T) {
  return Object.keys(o) as Array<keyof T>;
}

// centralize the only cast needed to satisfy AG Grid's ColDefField
function toColDefField<R extends object, K extends Extract<keyof R, string>>(
  key: K
): ColDefField<R, R[K]> {
  return key as unknown as ColDefField<R, R[K]>;
}

/* ------------------------------
   Generic Grid (schema prop)
------------------------------ */

export type ColumnType = 'date' | 'number' | 'text';

export type SchemaGridProps<S extends Record<string, FieldSpec<unknown>>> = {
  /** Generic schema that defines how to parse CSV and the output fields */
  schema: S;
  /** Optional initial data */
  initialRows?: InferRow<S>[];
  /** If true, append imported CSV rows; otherwise replace (default false) */
  appendOnImport?: boolean;
  /** Hints for which editor/formatter to use per field (optional) */
  columnTypes?: Partial<Record<keyof InferRow<S>, ColumnType>>;
  /** Overlay text shown during drag */
  csvOverlayLabel?: string;
};

export default function SchemaGrid<S extends Record<string, FieldSpec<unknown>>>({
                                                                                   schema,
                                                                                   initialRows,
                                                                                   appendOnImport = false,
                                                                                   columnTypes,
                                                                                   csvOverlayLabel = 'Drop CSV to import',
                                                                                 }: SchemaGridProps<S>): JSX.Element {
  type Row = InferRow<S>;

  const [rowData, setRowData] = useState<Row[]>(initialRows ?? []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<AgGridReact<Row>>(null);

  // stable wrappers for formatters/parsers
  const numberFormatterRow = useCallback(
    (p: ValueFormatterParams<Row, number>) => numberFormatter<Row>(p),
    []
  );
  const numberParserRow = useCallback(
    (p: ValueParserParams<Row, number>) => numberParser<Row>(p),
    []
  );
  const dateFormatterRow = useCallback(
    (p: ValueFormatterParams<Row, string>) => dateFormatter<Row>(p),
    []
  );
  const dateParserRow = useCallback(
    (p: ValueParserParams<Row, string>) => dateParser<Row>(p),
    []
  );

  // Build columns from schema + type hints
  const columnDefs = useMemo<ColDef<Row>[]>(() => {
    const defs: ColDef<Row>[] = [];

    for (const k of keysOf(schema)) {
      const outKey = k;
      const fieldStr = outKey as Extract<keyof Row, string>;
      const field = toColDefField<Row, typeof fieldStr>(fieldStr);

      const spec = schema[k];
      const headerName = spec!.from ?? (k as string);
      const hint = (columnTypes?.[outKey]) ?? 'text';

      const base: ColDef<Row> = {
        field,
        headerName,
        editable: true,
        width: 160,
      };

      let typedExtras: Partial<ColDef<Row>> = {};
      switch (hint) {
        case 'date':
          typedExtras = {
            cellEditor: 'agDateStringCellEditor',
            valueFormatter: dateFormatterRow,
            valueParser: dateParserRow,
          };
          break;
        case 'number':
          typedExtras = {
            valueFormatter: numberFormatterRow,
            valueParser: numberParserRow,
            width: 140,
          };
          break;
        default:
          // 'text' — no extras
          break;
      }

      defs.push({ ...base, ...typedExtras });
    }

    return defs;
  }, [schema, columnTypes, dateFormatterRow, dateParserRow, numberFormatterRow, numberParserRow]);

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  );

  const onCellValueChanged = useCallback((_e: CellValueChangedEvent<Row>) => {
    setRowData((prev) => [...prev]); // clone to rerender after in-place edit
  }, []);

  // CSV import via the very same schema prop
  const importCsvFile = useCallback(
    async (file: File, { append }: { append: boolean }) => {
      const text = await file.text();
      const parsed = parseCsvWithSchema(text, schema);
      if (!parsed.ok) {
        console.error(parsed.errors.join('\n'));
        return;
      }
      setRowData((prev) => (append ? [...prev, ...parsed.rows] : parsed.rows));
      // You can surface parsed.warnings if you want
    },
    [schema]
  );

  // DnD + picker
  const prevent = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { prevent(e); setDragActive(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { prevent(e); setDragActive(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    prevent(e); setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      console.warn('Only .csv files are supported'); return;
    }
    void importCsvFile(file, { append: appendOnImport });
  };
  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void importCsvFile(file, { append: appendOnImport });
    e.target.value = ''; // allow reselecting same file
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ position: 'relative' }}
    >
      {/* Controls */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc' }}
        >
          Import CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handlePick}
          style={{ display: 'none' }}
        />
      </div>

      {/* Drag overlay */}
      {dragActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            zIndex: 5,
            borderRadius: 8,
            pointerEvents: 'none',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {csvOverlayLabel}
        </div>
      )}

      {/* Grid */}
      <div style={{ height: 440, width: '100%' }}>
        <AgGridReact<Row>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          singleClickEdit
          stopEditingWhenCellsLoseFocus={false}
          onCellValueChanged={onCellValueChanged}
          theme={themeQuartz}
        />
      </div>
    </div>
  );
}

/* ------------------------------
   Example usage
------------------------------ */

// Define a schema wherever you consume the component:
export const ExampleSchema = {
  date:    { from: 'Date',    required: true,  parse: parseYyyyMmDd },
  amount1: { from: 'Amount1', required: true,  parse: parseNumberLoose, default: 0 },
  amount2: { from: 'Amount2', required: true,  parse: parseNumberLoose, default: 0 },
} satisfies Record<string, FieldSpec<unknown>>;

export type ExampleRow = InferRow<typeof ExampleSchema>;

export const exampleColumnTypes: Partial<Record<keyof ExampleRow, ColumnType>> = {
  date: 'date',
  amount1: 'number',
  amount2: 'number',
};

/*
In a page:

<SchemaGrid
  schema={ExampleSchema}
  columnTypes={exampleColumnTypes}
  initialRows={[
    { date: '2025-09-01', amount1: 1200.5, amount2: 300 },
    { date: '2025-09-05', amount1: 450, amount2: 75.25 },
  ]}
/>
*/
