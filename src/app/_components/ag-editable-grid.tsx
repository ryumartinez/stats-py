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
   Schema (inline)
------------------------------ */

const RowSchema = {
  date:    { from: 'Date',    required: true,  parse: parseYyyyMmDd },
  amount1: { from: 'Amount1', required: true,  parse: parseNumberLoose, default: 0 },
  amount2: { from: 'Amount2', required: true,  parse: parseNumberLoose, default: 0 },
} satisfies Record<string, FieldSpec<unknown>>;

type Row = InferRow<typeof RowSchema>;

/* ------------------------------ */

const initialRows: Row[] = [
  { date: '2025-09-01', amount1: 1200.5, amount2: 300 },
  { date: '2025-09-05', amount1: 450,    amount2: 75.25 },
  { date: '2025-09-12', amount1: 999,    amount2: 123.45 },
];

export default function AgEditableGrid(): JSX.Element {
  const [rowData, setRowData] = useState<Row[]>(initialRows);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<AgGridReact<Row>>(null);

  // ---- Parsers & formatters (typed, stable) ----
  const numberParser = useCallback((p: ValueParserParams<Row, number>): number => {
    const n = Number(p.newValue);
    return Number.isFinite(n) ? n : 0;
  }, []);

  const numberFormatter = useCallback((p: ValueFormatterParams<Row, number>): string => {
    return typeof p.value === 'number'
      ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : '';
  }, []);

  const dateFormatter = useCallback((p: ValueFormatterParams<Row, string>): string => {
    const value = p.value ?? '';
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
  }, []);

  const dateParser = useCallback((p: ValueParserParams<Row, string>): string => {
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
  }, []);

  // ---- Columns ----
  const columnDefs = useMemo<ColDef<Row>[]>(() => [
    {
      field: 'date',
      headerName: 'Date',
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      valueFormatter: dateFormatter,
      valueParser: dateParser,
      width: 160,
    },
    {
      field: 'amount1',
      headerName: 'Amount1',
      editable: true,
      valueParser: numberParser,
      valueFormatter: numberFormatter,
      width: 140,
    },
    {
      field: 'amount2',
      headerName: 'Amount2',
      editable: true,
      valueParser: numberParser,
      valueFormatter: numberFormatter,
      width: 140,
    },
  ], [dateFormatter, dateParser, numberFormatter, numberParser]);

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  );

  const onCellValueChanged = useCallback((_e: CellValueChangedEvent<Row>): void => {
    // AG Grid mutates rows; clone to force React rerender
    setRowData((prev) => [...prev]);
  }, []);

  // ---- CSV import using inline schema ----
  const importCsvFile = useCallback(async (file: File, { append }: { append: boolean }) => {
    const text = await file.text();
    const parsed = parseCsvWithSchema(text, RowSchema);
    if (!parsed.ok) {
      console.error(parsed.errors.join('\n'));
      return;
    }
    // Optionally surface parsed.warnings
    setRowData((prev) => (append ? [...prev, ...parsed.rows] : parsed.rows));
  }, []);

  // ---- DnD + picker ----
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
    void importCsvFile(file, { append: false });
  };
  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void importCsvFile(file, { append: false });
    e.target.value = ''; // allow reselecting the same file
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
          Drop CSV to import (Date, Amount1, Amount2)
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
