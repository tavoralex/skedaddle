import Grid from "./../../scentmap/hexgrid/Grid";
import * as PIXI from "pixi.js";

export function makeHexTexture(grid: Grid, app: PIXI.Application) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xffffff);
    graphics.beginFill(0xffffff);
    const corners = grid.getHexShape();
    const pixiCorners = corners.map((c: any) => {
        return new PIXI.Point(c.x, c.y);
    });
    const poly = new PIXI.Polygon(pixiCorners);
    // poly.close();
    graphics.drawPolygon(poly);
    graphics.endFill();
    return app.renderer.generateTexture(graphics, PIXI.SCALE_MODES.NEAREST, 1);
}
