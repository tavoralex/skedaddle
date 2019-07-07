import {IScent} from "../../scentmap/scent/types";

export function makeUpdateHexColorsByScent(gridSprites: PIXI.Sprite[], scent: IScent) {
    const average = (scent.quantity + scent.minValue) / 20;
    return (delta: number) => {
        gridSprites.forEach((s, i) => {
            s.tint = scent.hue;
            s.alpha = Math.min(0.75, Math.min(average, scent.scentGrid[i]) / average);
        });
    };
}
