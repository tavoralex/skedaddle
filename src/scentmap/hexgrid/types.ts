export interface IGridParams {
    rows: number;
    columns: number;
    hexSize: number;
}

export interface IGridNode {
    neighbors: number[];
    neighbors2: number[];
    id: string;
    position: {x: number; y: number};
}
