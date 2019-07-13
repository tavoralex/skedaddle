import makeCamera from "../makeCamera";
import Grid from "../../scentmap/hexgrid/Grid";

export default function makeGridCamera(pixi: PIXI.Application, grid: Grid, hexSize: number) {
    const lastNode = grid.gridArr[grid.gridArr.length - 1];
    const height = lastNode.position.y + hexSize * 2;
    const width = lastNode.position.x + hexSize * 2;

    const cam = makeCamera(pixi, width, height)
        // .wheel()
        .drag()
        // .pinch()
        // .decelerate()
        .clamp({direction: "all", underflow: "center"})
        .clampZoom({minWidth: width, minHeight: height});
    // .bounce()
    cam.position.set(width / 2, height / 2);
    return cam;
}
