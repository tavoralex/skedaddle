import Grid from "scentmap/hexgrid/Grid";
import {IDisplay} from "pixi/types";

export type GridMap = {grid: Grid; walls: number[]; display: IDisplay};
