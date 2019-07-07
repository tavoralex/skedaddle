import {IScent} from "./types";
import Grid from "../hexgrid/Grid";

export function makeUpdateScent(grid: Grid, walls: number[], scent: IScent, scentGrid: number[]) {
    return (delta: number) => {
        for (let node = 0; node < scentGrid.length; node++) {
            const w = walls[node];
            if (isNaN(w) || !w) {
                scentGrid[node] = 0;
                continue;
            }
            const targets = grid.gridArr[node].neighbors;
            const scentVal = scentGrid[node];
            if (isNaN(scentVal) || !scent) {
                scentGrid[node] = 0;
                continue;
            }
            const validTargets = targets.filter(id => !isNaN(walls[id]) && walls[id]);
            const dSpread = Math.min(1, scent.spread * delta);
            const distribute = scentVal * dSpread;
            const dSlice = (distribute / validTargets.length) * scent.evaporation;
            for (let id of validTargets) {
                const v = dSlice * walls[id];
                scentGrid[id] += v;
            }
            scentGrid[node] = scentGrid[node] - distribute;
        }
        scent.scentGrid.forEach((n, nodeId) => {
            const s = scentGrid[nodeId];
            scent.scentGrid[nodeId] = s >= scent.minValue ? s : 0;
        });
    };
}
