// adapted from http://www.redblobgames.com/grids/hexagons/

/* Specifically for offset grid diagrams */
export function makeRectangularShape(
    minCol: number,
    maxCol: number,
    minRow: number,
    maxRow: number,
    convert: (coord: OffsetCoord) => Hex
) {
    const results = [];
    for (let col = minCol; col <= maxCol; col++) {
        for (let row = minRow; row <= maxRow; row++) {
            const hex = convert(new OffsetCoord(col, row));
            results.push(hex);
        }
    }
    return results;
}

/* Specifically for doubled grid diagrams */
export function makeRDoubledRectangularShape(minCol: number, maxCol: number, minRow: number, maxRow: number) {
    const results = [];
    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol + (row & 1); col <= maxCol; col += 2) {
            const hex = new DoubledCoord(col, row).rdoubledToCube();
            results.push(hex);
        }
    }
    return results;
}

export function makeLine(A: Hex, B: Hex) {
    /* see https://www.redblobgames.com/grids/line-drawing.html */

    /* HACK: add a tiny offset to the start point to break ties,
     * because there are a lot of ties on a grid, and I want it to
     * always round the same direction for consistency. To demonstrate
     * the need for this hack, draw a line from Hex(-5, 0, +5) to
     * Hex(+5, -5, 0). Without the hack, there are points on the edge
     * that will sometimes be rounded one way and sometimes the other.
     * The hack will force them to be rounded consistently. */
    const offset = new Hex(1e-6, 2e-6, -3e-6);

    const N = A.subtract(B).len();
    const results = [];
    for (let i = 0; i <= N; i++) {
        results.push(
            A.lerp(B, i / Math.max(1, N))
                .add(offset)
                .round()
        );
    }
    return results;
}

export class Point {
    constructor(public x: number, public y: number) {}
}

export class Hex {
    public static directions: Hex[] = [
        new Hex(1, 0, -1),
        new Hex(1, -1, 0),
        new Hex(0, -1, 1),
        new Hex(-1, 0, 1),
        new Hex(-1, 1, 0),
        new Hex(0, 1, -1)
    ];

    public static diagonals: Hex[] = [
        new Hex(2, -1, -1),
        new Hex(1, -2, 1),
        new Hex(-1, -1, 2),
        new Hex(-2, 1, 1),
        new Hex(-1, 2, -1),
        new Hex(1, 1, -2)
    ];

    public static direction(direction: number): Hex {
        return Hex.directions[direction];
    }

    private n8s!: Hex[];
    private roundHex!: Hex;

    constructor(public q: number, public r: number, public s: number) {
        if (Math.round(q + r + s) !== 0) throw new Error("q + r + s must be 0");
    }

    get id() {
        return `${this.q} ${this.r} ${this.s}`;
    }

    public add(b: Hex): Hex {
        return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
    }

    public subtract(b: Hex): Hex {
        return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
    }

    public scale(k: number): Hex {
        return new Hex(this.q * k, this.r * k, this.s * k);
    }

    public rotateLeft(): Hex {
        return new Hex(-this.s, -this.q, -this.r);
    }

    public rotateRight(): Hex {
        return new Hex(-this.r, -this.s, -this.q);
    }

    public neighbors(): Hex[] {
        if (this.n8s) return this.n8s;
        this.n8s = Hex.directions.map(direction => this.add(direction));
        return this.n8s;
    }

    public neighbor(direction: number): Hex {
        return this.neighbors()[direction];
    }

    public diagonalNeighbor(direction: number): Hex {
        return this.add(Hex.diagonals[direction]);
    }

    public len(): number {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    }

    public distance(b: Hex): number {
        return this.subtract(b).len();
    }

    public round(): Hex {
        if (this.roundHex) return this.roundHex;
        let qi: number = Math.round(this.q);
        let ri: number = Math.round(this.r);
        let si: number = Math.round(this.s);
        const qDiff: number = Math.abs(qi - this.q);
        const rDiff: number = Math.abs(ri - this.r);
        const sDiff: number = Math.abs(si - this.s);
        if (qDiff > rDiff && qDiff > sDiff) {
            qi = -ri - si;
        } else if (rDiff > sDiff) {
            ri = -qi - si;
        } else {
            si = -qi - ri;
        }
        this.roundHex = new Hex(qi, ri, si);
        return this.roundHex;
    }

    public lerp(b: Hex, t: number): Hex {
        return new Hex(this.q * (1 - t) + b.q * t, this.r * (1 - t) + b.r * t, this.s * (1 - t) + b.s * t);
    }

    public linedraw(b: Hex): Hex[] {
        const N: number = this.distance(b);
        const aNudge: Hex = new Hex(this.q + 0.000001, this.r + 0.000001, this.s - 0.000002);
        const bNudge: Hex = new Hex(b.q + 0.000001, b.r + 0.000001, b.s - 0.000002);
        const results: Hex[] = [];
        const step: number = 1.0 / Math.max(N, 1);
        for (let i = 0; i <= N; i++) {
            results.push(aNudge.lerp(bNudge, step * i).round());
        }
        return results;
    }
}

export class OffsetCoord {
    public static EVEN: number = 1;
    public static ODD: number = -1;

    public static qoffsetFromCube(offset: number, h: Hex): OffsetCoord {
        const col: number = h.q;
        const row: number = h.r + (h.q + offset * (h.q & 1)) / 2;
        return new OffsetCoord(col, row);
    }

    public static qoffsetToCube(offset: number, h: OffsetCoord): Hex {
        const q: number = h.col;
        const r: number = h.row - (h.col + offset * (h.col & 1)) / 2;
        const s: number = -q - r;
        return new Hex(q, r, s);
    }

    public static roffsetFromCube(offset: number, h: Hex): OffsetCoord {
        const col: number = h.q + (h.r + offset * (h.r & 1)) / 2;
        const row: number = h.r;
        return new OffsetCoord(col, row);
    }

    public static roffsetToCube(offset: number, h: OffsetCoord): Hex {
        const q: number = h.col - (h.row + offset * (h.row & 1)) / 2;
        const r: number = h.row;
        const s: number = -q - r;
        return new Hex(q, r, s);
    }
    constructor(public col: number, public row: number) {}
}

export class DoubledCoord {
    public static qdoubledFromCube(h: Hex): DoubledCoord {
        const col: number = h.q;
        const row: number = 2 * h.r + h.q;
        return new DoubledCoord(col, row);
    }

    public static rdoubledFromCube(h: Hex): DoubledCoord {
        const col: number = 2 * h.q + h.r;
        const row: number = h.r;
        return new DoubledCoord(col, row);
    }

    constructor(public col: number, public row: number) {}

    public qdoubledToCube(): Hex {
        const q: number = this.col;
        const r: number = (this.row - this.col) / 2;
        const s: number = -q - r;
        return new Hex(q, r, s);
    }

    public rdoubledToCube(): Hex {
        const q: number = (this.col - this.row) / 2;
        const r: number = this.row;
        const s: number = -q - r;
        return new Hex(q, r, s);
    }
}

export class Orientation {
    constructor(
        public f0: number,
        public f1: number,
        public f2: number,
        public f3: number,
        public b0: number,
        public b1: number,
        public b2: number,
        public b3: number,
        public startAngle: number
    ) {}
}

export class Layout {
    public static pointy: Orientation = new Orientation(
        Math.sqrt(3.0),
        Math.sqrt(3.0) / 2.0,
        0.0,
        3.0 / 2.0,
        Math.sqrt(3.0) / 3.0,
        -1.0 / 3.0,
        0.0,
        2.0 / 3.0,
        0.5
    );
    public static flat: Orientation = new Orientation(
        3.0 / 2.0,
        0.0,
        Math.sqrt(3.0) / 2.0,
        Math.sqrt(3.0),
        2.0 / 3.0,
        0.0,
        -1.0 / 3.0,
        Math.sqrt(3.0) / 3.0,
        0.0
    );
    constructor(public orientation: Orientation, public size: Point, public origin: Point) {}

    public hexToPixel(h: Hex): Point {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const origin: Point = this.origin;
        const x: number = (M.f0 * h.q + M.f1 * h.r) * size.x;
        const y: number = (M.f2 * h.q + M.f3 * h.r) * size.y;
        return new Point(x + origin.x, y + origin.y);
    }

    public pixelToHex(p: Point): Hex {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const origin: Point = this.origin;
        const pt: Point = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
        const q: number = M.b0 * pt.x + M.b1 * pt.y;
        const r: number = M.b2 * pt.x + M.b3 * pt.y;
        return new Hex(q, r, -q - r);
    }

    public hexCornerOffset(corner: number): Point {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const angle: number = (2.0 * Math.PI * (M.startAngle - corner)) / 6;
        return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
    }

    public polygonCorners(h: Hex): Point[] {
        const corners: Point[] = [];
        const center: Point = this.hexToPixel(h);
        for (let i = 0; i < 6; i++) {
            const offset: Point = this.hexCornerOffset(i);
            corners.push(new Point(center.x + offset.x, center.y + offset.y));
        }
        return corners;
    }
}
