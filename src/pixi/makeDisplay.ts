import Grid from "../scentmap/hexgrid/Grid";
import {IDisplay} from "./types";
import {makePixiApp} from "./makePixiApp";
import {makeHexTexture} from "./hexgrid/makeHexTexture";
import {makeHexesGrid} from "./hexgrid/makeHexesGrid";
import makeGridCamera from "./hexgrid/makeGridCamera";
import repaintWithNoise from "./hexgrid/repaintWithNoise";
import {animationLoop} from "../utils/loop/animationLoop";
import addPrettyHexesClick from "./hexgrid/addPrettyHexesClick";
import {makeWallsView} from "./walls/makeWallsView";

export enum BgType {
    staticNoise,
    animatedNoise,
    prettyHexesClick,
    none
}

export default function makeDisplay(
    gameCanvas: HTMLDivElement,
    grid: Grid,
    walls: number[],
    bgType: BgType = BgType.none
): IDisplay {
    const hs = grid.gridLayout.hexSize;
    const pixi = makePixiApp(window.innerWidth - hs * 0.5, window.innerHeight - hs * 0.5);
    const tex = makeHexTexture(grid, pixi);
    const hexes = makeHexesGrid(grid, tex);
    const bgSprites = hexes.nodes;
    const camera = makeGridCamera(pixi, grid, hs);
    const repaint = () => repaintWithNoise(grid, bgSprites, grid.gridArr.length / 10, 0.01);
    switch (bgType) {
        case BgType.animatedNoise:
            animationLoop(repaint);
            break;
        case BgType.prettyHexesClick:
            addPrettyHexesClick(grid, camera, hexes.nodes);
            break;
        case BgType.staticNoise:
            repaint();
            break;
        default:
            break;
    }
    camera.addChild(hexes.view);

    const wallsView = makeWallsView(grid, walls, tex);
    camera.addChild(wallsView.view);

    gameCanvas.appendChild(pixi.view);

    return {pixi, bgSprites, camera, hexTexture: tex, wallsSprites: wallsView.nodes};
}
