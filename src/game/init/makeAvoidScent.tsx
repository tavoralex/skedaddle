import {makeScent} from "../../scentmap/scent/makeScent";
import {makeHexesGrid} from "../../pixi/hexgrid/makeHexesGrid";
import {GridMap} from "types";
import {makeUpdateScent} from "scentmap/scent/makeUpdateScent";
import {makeUpdateHexColorsByScent} from "pixi/scent/makeUpdateHexColorsByScent";
export const makeAvoidScent = (map: GridMap) => {
    const data = makeScent(map.grid);
    const display = makeHexesGrid(map.grid, map.display.hexTexture, data.hue);
    map.display.camera.addChild(display.view);
    const updateScent = makeUpdateScent(map.grid, map.walls, data, data.scentGrid);
    const updateScentView = makeUpdateHexColorsByScent(display.nodes, data);
    const update = (delta: number) => {
        updateScent(delta);
        updateScentView(delta);
    };
    return {data: data, display: display, update};
};
