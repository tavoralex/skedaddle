import Grid from "./../../scentmap/hexgrid/Grid";
import * as PIXI from "pixi.js";

export function makeHexesGrid(grid: Grid, tex: PIXI.Texture, tint: number = 0xddddda) {
    const view = new PIXI.ParticleContainer(500000, {
        tint: true
    });
    const nodes = grid.gridArr.map(node => {
        const sprite = new PIXI.Sprite(tex);
        sprite.position.set(node.position.x, node.position.y);
        view.addChild(sprite);
        sprite.tint = tint;
        sprite.alpha = 0;
        return sprite;
    });

    return {view, nodes};
}
