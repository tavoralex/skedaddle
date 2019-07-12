import {IScent} from "./types";
import {uuid} from "../../utils/uuid";
import Grid from "../hexgrid/Grid";

export function makeScent(
    grid: Grid,
    spread: number = 15,
    evaporation: number = 0.9,
    quantity: number = 10,
    hue: number = 8454143,
    minValue: number = 0.001,
    seconds: number = 0
): IScent {
    const scentGrid: number[] = Array.from(grid.gridArr, n => 0);
    const permeability: number[] = Array.from(grid.gridArr, n => 1);
    return {
        scentGrid,
        permeability,
        id: uuid(),
        spread,
        evaporation,
        quantity,
        hue,
        minValue,
        seconds
    };
}
