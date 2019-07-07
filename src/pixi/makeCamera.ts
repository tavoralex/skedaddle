import {Viewport} from "pixi-viewport";

export default function makeCamera(pixi: PIXI.Application, worldWidth: number, worldHeight: number) {
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth,
        worldHeight
    });
    pixi.stage.addChild(viewport);
    return viewport;
}
