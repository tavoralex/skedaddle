import {ClickEventData} from "pixi-viewport";
import {IDisplay} from "./types";
import Grid from "../scentmap/hexgrid/Grid";

export default function addDisplayClickListener(display: IDisplay, grid: Grid, onClick: (node: number) => void) {
    const hs = grid.gridLayout.hexSize * 0.75;
    const onViewClicked = (data: ClickEventData) => {
        const i = grid.getHexIdByPixel({x: data.world.x - hs, y: data.world.y - hs});
        onClick(i);
    };
    display.camera.on("clicked", onViewClicked);
}
