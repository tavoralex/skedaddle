import Grid from "../../scentmap/hexgrid/Grid";
import {makeWalls} from "../../scentmap/walls/makeWalls";
import makeDisplay, {BgType} from "../../pixi/makeDisplay";
import {GridMap} from "types";

const rows = 50;
const columns = rows;
const hexSize = 10;

export const makeMap = (gameCanvas: HTMLDivElement) => {
    const grid = new Grid({rows, columns, hexSize});
    const walls = makeWalls(grid);
    const display = makeDisplay(gameCanvas, grid, walls, BgType.none);
    return {grid, walls, display} as GridMap;
};
