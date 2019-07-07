import {ClickEventData} from "pixi-viewport";
import Grid from "../../scentmap/hexgrid/Grid";
import {distanceSq} from "../../utils/geom";
import {Sprite} from "pixi.js";
import {hexToRgb, rgbToHsl, rgbArrayToHex, hslToRgb} from "../../utils/colorConversions";

export default function addPrettyHexesClick(grid: Grid, camera: any, hexes: Sprite[]) {
    const getDistances = (hexPoint: {x: number; y: number}) => {
        let maxDist = 0;
        const distances = grid.gridArr.map(node => {
            const dist = distanceSq(hexPoint, node.position);
            dist >= maxDist && (maxDist = dist);
            return dist;
        });
        return {maxDist, distances};
    };
    const processNodesForDistance = (dist: {maxDist: number; distances: number[]}) => (
        node: PIXI.Sprite,
        i: number
    ) => {
        const rgb = hexToRgb(node.tint);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.g);
        const d = Math.sqrt(dist.distances[i] / dist.maxDist);
        hsl[0] = d;
        hsl[1] = hsl[2] = 0.5;
        // @ts-ignore
        const rgb2 = hslToRgb(...hsl);
        const hex2 = rgbArrayToHex(rgb2);
        node.tint = hex2;
    };
    const onViewClicked = (data: ClickEventData) => {
        const hexPoint = grid.getHexPosAtPixel(data.world);
        const processNode = processNodesForDistance(getDistances(hexPoint));
        hexes.forEach(processNode);
    };
    camera.on("clicked", onViewClicked);
}
