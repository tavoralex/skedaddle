import Grid from "./../../scentmap/hexgrid/Grid";
import * as PIXI from "pixi.js";

export function makeWallsView(grid: Grid, walls: number[], tex: PIXI.Texture) {
    const view = new PIXI.ParticleContainer(500000, {
        tint: true
    });
    const nodes = grid.gridArr.map((node, i) => {
        const sprite = new PIXI.Sprite(tex);
        sprite.position.set(node.position.x, node.position.y);
        view.addChild(sprite);
        sprite.tint = 0xffff80;
        sprite.alpha = Math.abs(walls[i] - 1);
        return sprite;
    });
    return {view, nodes};
}
