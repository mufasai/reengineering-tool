declare module 'ag-grid-solid' {
    import { Component } from 'solid-js';
    import { GridOptions, Module } from 'ag-grid-community';

    export interface AgGridSolidProps extends GridOptions {
        gridOptions?: GridOptions;
        modules?: Module[];
        rowData?: any[];
        columnDefs?: any[];
        class?: string;
        style?: any;
    }

    const AgGridSolid: Component<AgGridSolidProps>;
    export default AgGridSolid;
}
