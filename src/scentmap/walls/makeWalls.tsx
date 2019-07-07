import Grid from "../hexgrid/Grid";

export function makeWalls(grid: Grid) {
    const numNodes = grid.gridArr.length;
    const walls: number[] = new Array(numNodes).fill(1);
    walls.forEach((w, i) => {
        grid.edges.indexOf(i) !== -1 && (walls[i] = 0);
    });
    return walls;
}
