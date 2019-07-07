import {hslToRgb, rgbArrayToHex} from "../../utils/colorConversions";
import {Sprite} from "pixi.js";
import Grid from "../../scentmap/hexgrid/Grid";
import * as noise from "../../utils/simplexNoise";

noise.seed(Math.random());
const defaultSpeed = 1;
let step = 0;
let current = Date.now();
export default function repaintWithNoise(
    grid: Grid,
    sprites: Sprite[],
    scale: number = 0,
    speed: number = defaultSpeed
) {
    const noiseScale = !scale ? Math.sqrt(grid.gridArr.length) * 12 : scale;
    sprites.forEach((sprite: Sprite, i: number) => {
        const pos = grid.gridArr[i].position;
        const rgb2 = hslToRgb(noise.simplex3(pos.x / noiseScale, pos.y / noiseScale, step), 0.5, 0.5);
        const tint = rgbArrayToHex(rgb2);
        sprite.tint = tint;
    });
    const nc = Date.now();
    step += speed / (nc - current);
    current = nc;
}
