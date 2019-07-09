import addDisplayClickListener from "pixi/addDisplayClickListener";
import addDisplayDragListener from "pixi/addDisplayDragListener";
import {IDisplay} from "pixi/types";
import Grid from "scentmap/hexgrid/Grid";

export function addDropFunctionality(display: IDisplay, grid: Grid, action: (node: number) => void) {
    addDisplayClickListener(display, grid, action);
    const onStart: (node: number) => void = (node: number) => {
        // display.camera.pausePlugin("drag");
    };
    const onEnd: (node: number) => void = (node: number) => {
        // display.camera.resumePlugin("drag");
    };
    const onMove: (node: number) => void = action;
    addDisplayDragListener(display, grid, onStart, onEnd, onMove);
}
