'use client';

import React, { useMemo, useRef, useState } from 'react';
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

// Register all Community features (required in v34+)
ModuleRegistry.registerModules([AllCommunityModule]);

// Define the row type
type Row = {
  date: string;   // stored as 'YYYY-MM-DD'
  amount1: number;
  amount2: number;
};

const initialRows: Row[] = [
  { date: '2025-09-01', amount1: 1200.5, amount2: 300 },
  { date: '2025-09-05', amount1: 450, amount2: 75.25 },
  { date: '2025-09-12', amount1: 999, amount2: 123.45 },
];

export default function AgEditableGrid() {
  const [rowData, setRowData] = useState<Row[]>(initialRows);
  const gridRef = useRef<AgGridReact<Row>>(null);

  // Number parser (ensures parsed value is always a number)
  const numberParser = (p: ValueParserParams<Row>): number => {
    const n = Number(p.newValue);
    return Number.isFinite(n) ? n : 0;
  };

  // Number formatter (localizes numbers with 2 decimals max)
  const numberFormatter = (p: ValueFormatterParams<Row>): string =>
    typeof p.value === 'number'
      ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : '';

  // Date formatter (displays as locale string)
  const dateFormatter = (p: ValueFormatterParams<Row, string>): string => {
    const value = p.value as string | undefined;
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString();
  };

// Date parser (ensures YYYY-MM-DD format)
  const dateParser = (p: ValueParserParams<Row, string>): string => {
    const val = String(p.newValue ?? '').trim();
    const asDate = new Date(val);

    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    if (!isNaN(asDate.getTime())) {
      const y = asDate.getFullYear();
      const m = String(asDate.getMonth() + 1).padStart(2, '0');
      const d = String(asDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return (p.oldValue!) ?? '';
  };

  // Define column definitions
  const columnDefs = useMemo<ColDef<Row>[]>(
    () => [
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
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  function onCellValueChanged(_e: CellValueChangedEvent<Row>): void {
    // AG Grid mutates row objects in place — clone to force React rerender
    setRowData((prev) => [...prev]);
  }

  return (
    <div style={{ height: 440, width: '100%' }}>
      <AgGridReact<Row>
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        singleClickEdit
        stopEditingWhenCellsLoseFocus={false}
        onCellValueChanged={onCellValueChanged}
        theme={themeQuartz}   // ✅ Theming API
      />
    </div>
  );
}
