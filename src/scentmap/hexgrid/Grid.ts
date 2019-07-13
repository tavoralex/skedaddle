import {IGridNode, IGridParams} from "./types";
import * as hexagons from "./hexagons";
import {IPoint} from "./../../utils/geom";

const makeNeighbors2 = (h: hexagons.Hex): hexagons.Hex[] => {
    const n2: hexagons.Hex[] = Array.from(
        new Set<hexagons.Hex>(([] as hexagons.Hex[]).concat.apply([], h.neighbors().map(hh => hh.neighbors())))
    );
    return n2;
};

export default class Grid {
    public gridArr: IGridNode[];
    public edges: number[];
    public gridHash: {[key: string]: number};
    private _layout: hexagons.Layout;
    private _hexes: hexagons.Hex[];

    constructor(public gridLayout: IGridParams) {
        this._hexes = hexagons.makeRDoubledRectangularShape(0, gridLayout.columns, 0, gridLayout.rows);
        console.log(`gid with ${this._hexes.length} hexes`);
        const hIds = this._hexes.reduce(
            (acc: {[key: string]: number}, cur: hexagons.Hex, i: number) => {
                acc[cur.id] = i;
                return acc;
            },
            {} as {[key: string]: number}
        );
        this._layout = new hexagons.Layout(
            hexagons.Layout.pointy,
            {x: gridLayout.hexSize, y: gridLayout.hexSize},
            {x: 0, y: 0}
        );
        this.gridHash = {};
        this.gridArr = this._hexes.map((h, i) => {
            const entry: IGridNode = {
                id: h.id,
                neighbors: h.neighbors().map(n => hIds[n.id]),
                neighbors2: makeNeighbors2(h)
                    .map(n => hIds[n.id])
                    .filter(id => String(id) !== String(h.id)),
                position: this._layout.hexToPixel(h)
            };
            this.gridHash[entry.id] = i;
            return entry;
        });
        this.edges = this.gridArr.reduce((acc, cur, i) => {
            if (cur.neighbors.findIndex(v => typeof v === "undefined") !== -1) acc.push(i);
            return acc;
        }, new Array<number>());
    }

    public getHexShape(): IPoint[] {
        return this._layout.polygonCorners(this._hexes[0]);
    }

    public getHexPosAtPixel(world: IPoint): IPoint {
        return this._layout.hexToPixel(this._layout.pixelToHex(world));
    }

    public getPosAtNode(nodeId: number): IPoint {
        const node = this.gridArr[nodeId];
        if (!node) throw new Error(`Node ${nodeId} not found`);
        return {...node.position};
    }

    public getHexIdByPixel(position: IPoint): number {
        const hex = this._layout.pixelToHex(position).round();
        return this.gridHash[hex.id];
    }
}
