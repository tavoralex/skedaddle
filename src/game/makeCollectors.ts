import Grid from "scentmap/hexgrid/Grid";
import {IDisplay} from "../pixi/types";
import {makeBoidsViews} from "pixi/boids/makeBoidsViews";
import {GridBoids} from "boids/GridBoids";
import {collectorTouchedTween} from "./collectorTouchedTween";

export function makeCollectors(p: {
    display: IDisplay;
    grid: Grid;
    boids: GridBoids;
    colors: {top: number; bottom: number};
    actions: {onTopScored: () => void; onBottomScored: () => void};
}) {
    const {display, grid, boids, colors, actions: callbacks} = p;
    const top = Array.from({length: 22}, (n, i) => 53 + i);
    const bottom = Array.from({length: 22}, (n, i) => 1226 + i);
    const all = [...top, ...bottom];

    const views = makeBoidsViews(display.hexTexture, top.length + bottom.length);
    display.camera.addChild(views.view);

    const effectViews = makeBoidsViews(display.hexTexture, top.length + bottom.length);
    display.camera.addChild(effectViews.view);
    const effectSprites = effectViews.sprites;

    views.sprites.forEach((sprite, i) => {
        sprite.tint = i < top.length ? colors.top : colors.bottom;
        const p = grid.getPosAtNode(all[i]);
        sprite.position.set(p.x, p.y);
        sprite.scale.set(1, 1);

        const effectSprite = effectSprites[i];
        effectSprite.tint = i < top.length ? colors.top : colors.bottom;
        effectSprite.position.set(p.x + effectSprite.width / 2, p.y + effectSprite.height / 2);
        effectSprite.scale.set(1, 1);
        effectSprite.anchor.set(0.5, 0.5);
    });

    const update = (delta: number) => {
        boids.boids.forEach(boid => {
            const ind = all.indexOf(boid.node);
            if (ind !== -1) {
                boids.removeBoid(boid);
                const sprite = effectSprites[ind];
                collectorTouchedTween({sprite});
                ind < top.length ? callbacks.onTopScored() : callbacks.onBottomScored();
            }
        });
    };

    return {top, bottom, all, views, update};
}
