import makeCamera from "../makeCamera";
import Grid from "../../scentmap/hexgrid/Grid";

export default function makeGridCamera(pixi: PIXI.Application, grid: Grid, hexSize: number) {
    const lastNode = grid.gridArr[grid.gridArr.length - 1];
    const height = lastNode.position.y + hexSize * 2 + hexSize;
    const width = lastNode.position.x + hexSize * 2 + hexSize;

    return (
        makeCamera(pixi, width, height)
            // .wheel()
            .drag()
            // .pinch()
            .decelerate()
            .clamp({direction: "all", underflow: "center"})
            .clampZoom({minWidth: width, minHeight: height, maxHeight: height * 2, maxWidth: width * 2})
            .bounce()
    );
}
