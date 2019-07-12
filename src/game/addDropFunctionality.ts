import addDisplayClickListener from "pixi/addDisplayClickListener";
import addDisplayDragListener from "pixi/addDisplayDragListener";
import {IDisplay} from "pixi/types";
import Grid from "scentmap/hexgrid/Grid";

export function addDropFunctionality(
    display: IDisplay,
    grid: Grid,
    onDrag: (node: number) => void,
    onTap: (node: number) => void,
    onStart: () => void,
    onEnd: () => void
) {
    addDisplayClickListener(display, grid, onTap);
    // const onStart: (node: number) => void = (node: number) => {
    //     // display.camera.pausePlugin("drag");
    // };
    // const onEnd: (node: number) => void = (node: number) => {
    //     // display.camera.resumePlugin("drag");
    // };
    const onMove: (node: number) => void = onDrag;
    addDisplayDragListener(display, grid, onStart, onEnd, onMove);
}
