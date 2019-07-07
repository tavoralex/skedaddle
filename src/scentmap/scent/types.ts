export interface IScent {
    seconds: number;
    quantity: number;
    hue: number;
    scentGrid: number[];
    permeability: number[];
    spread: number;
    evaporation: number;
    id: string;
    minValue: number;
}

export interface IScents {
    scents: IScent[];
    scentGrids: number[][];
}
