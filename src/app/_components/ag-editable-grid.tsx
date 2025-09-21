'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,            // ✅ import theme object
  type ColDef,
  type CellValueChangedEvent,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

type Row = { id: number; title: string; count: number };

const initialRows: Row[] = [
  { id: 1, title: 'Example', count: 20 },
  { id: 2, title: 'Editable', count: 40 },
  { id: 3, title: 'Grid', count: 60 },
];

export default function AgEditableGrid() {
  const [rowData, setRowData] = useState<Row[]>(initialRows);
  const gridRef = useRef<AgGridReact<Row>>(null);

  const columnDefs = useMemo<ColDef<Row>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'title', headerName: 'Title', editable: true, flex: 1 },
      { field: 'count', headerName: 'Count', editable: true, width: 120, valueParser: p => Number(p.newValue) },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  );

  function onCellValueChanged(_e: CellValueChangedEvent<Row>) {
    setRowData(prev => [...prev]); // force rerender after in-place edit
  }

  return (
    <div style={{ height: 420, width: '100%' }}>
      <AgGridReact<Row>
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        singleClickEdit
        onCellValueChanged={onCellValueChanged}
        theme={themeQuartz}         // ✅ use Theming API
      />
    </div>
  );
}
