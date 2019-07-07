import * as PIXI from "pixi.js";

export function makePixiApp(width: number = window.innerWidth, height: number = window.innerHeight) {
    const app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x00
    });
    return app;
}
