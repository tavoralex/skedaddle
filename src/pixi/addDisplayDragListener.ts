import {ClickEventData} from "pixi-viewport";
import {IPoint} from "./../utils/geom";
import {IDisplay} from "./types";
import Grid from "../scentmap/hexgrid/Grid";

let isDragging = false;

export default function addDisplayDragListener(
    display: IDisplay,
    grid: Grid,
    onStart: (node: number) => void,
    onEnd: (node: number) => void,
    onMove: (node: number) => void
) {
    const hs = grid.gridLayout.hexSize * 0.75;
    const getNodeByPixel = (point: IPoint) => grid.getHexIdByPixel({x: point.x - hs, y: point.y - hs});

    const dragStart = (data: ClickEventData) => {
        isDragging = true;
        onStart(getNodeByPixel(data.world));
    };
    const dragEnd = (data: ClickEventData) => {
        isDragging = false;
        onEnd(getNodeByPixel(data.world));
    };
    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const node = getNodeByPixel(display.camera.toWorld(e.x, e.y));
        if (isNaN(node)) return;
        onMove(node);
    };

    const onTouchMove = (data: PIXI.interaction.InteractionEvent) => {
        const pos = data.data.global;
        const node = getNodeByPixel(display.camera.toWorld(pos.x, pos.y));
        if (isNaN(node)) return;
        onMove(node);
    };

    display.camera.on("drag-start", dragStart);
    display.camera.on("drag-end", dragEnd);
    display.camera.on("touchmove", onTouchMove);
    document.addEventListener("mousemove", onMouseMove);
}
