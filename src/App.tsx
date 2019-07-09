import React, {useRef, useEffect} from "react";
import Grid from "./scentmap/hexgrid/Grid";
import {makeWalls} from "./scentmap/walls/makeWalls";
import makeDisplay, {BgType} from "./pixi/makeDisplay";
import {makeScent} from "./scentmap/scent/makeScent";
import {makeHexesGrid} from "./pixi/hexgrid/makeHexesGrid";
import {GridBoids} from "boids/GridBoids";
import {GridMap} from "types";
import {makeUpdateScent} from "scentmap/scent/makeUpdateScent";
import {makeUpdateHexColorsByScent} from "pixi/scent/makeUpdateHexColorsByScent";
import {IScent} from "scentmap/scent/types";
import timeVariableLoop, {ITime} from "utils/loop/timeVariableLoop";
import {addDropFunctionality} from "game/addDropFunctionality";
import makeScentDropper from "scentmap/scent/makeScentDropper";
import {makeCollectors} from "game/makeCollectors";
import {Hud} from "hud/Hud";
import {HudState} from "hud/types";
import {observable} from "mobx";

/*
  TODO
    * standalone proj for game
    * boilerplate
        * react + ts
        * scentmap
        * display with pixi
    * pre-placed map
    * pre-placed boids
        * template
        * positionings
    * main loop
    * scent drop
        * 1 scent
            * repulse
            * tweak in scent-grid
    * boid collecting walls
        * init with positions
            * top
            * bottom
        * displays
        * collision detection
            * destroy touching boid
            * collision effect on collided collector
                * tween scale & alpha
    * results counter
        * nice font
        * player 1 score
        * player 2 score
    fillbar
        spend rate
        refill rate
    peer connection
      pass data
      coordinate
    proper ui
      before game screen
      game ready screen
      game screen
      game over screen
    game time counter
    solve bug where boids get stuck in walls
    solve bug where switching tab and returning messes boids positions up
*/

const rows = 50;
const columns = rows;
const hexSize = 10;

const boidTemplate = {
    drag: 0.96,
    speed: 150,
    thrust: 10,
    radius: 1,
    olfaction: 0.001,
    hue: 0xaa0000,
    weights: {
        separation: 6,
        cohesion: 4,
        seekScent: 6,
        avoidScent: 8,
        avoidObstacles: 10,
        alignment: 5
    }
};

const makeMap = (gameCanvas: HTMLDivElement) => {
    const grid = new Grid({rows, columns, hexSize});
    const walls = makeWalls(grid);
    const display = makeDisplay(gameCanvas, grid, walls, BgType.none);
    return {grid, walls, display} as GridMap;
};

const makeAvoidScent = (map: GridMap) => {
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

const makeBoids = (map: GridMap, scent: IScent) => {
    const boids = new GridBoids(boidTemplate, map.grid, map.display, map.walls, scent);
    Array.from({length: 11}, (n, i) => {
        boids.addBoidAtNode(589 + i * 2);
        boids.addBoidAtNode(640 + i * 2);
        boids.addBoidAtNode(691 + i * 2);
    });
    return boids;
};

interface IDroppers {
    updates: Array<(delta: number) => boolean>;
}

const makeScentDroppers = (map: GridMap, scent: IScent) => {
    const droppers: IDroppers = {updates: []};
    const dropScent = (node: number) => {
        droppers.updates.push(makeScentDropper(scent, node, scent.seconds));
    };
    addDropFunctionality(map.display, map.grid, dropScent);
    const update = (delta: number) => {
        droppers.updates = droppers.updates.filter(update => update(delta));
    };

    return {update, droppers};
};

function initialize(gameCanvas: HTMLDivElement, hudState: HudState) {
    const onTopScored = () => {
        hudState.top += 1;
    };
    const onBottomScored = () => {
        hudState.bottom += 1;
    };
    const map = makeMap(gameCanvas);
    const scent = makeAvoidScent(map);
    const boids = makeBoids(map, scent.data);
    const droppers = makeScentDroppers(map, scent.data);
    const collectors = makeCollectors({
        display: map.display,
        grid: map.grid,
        boids,
        colors,
        actions: {onTopScored, onBottomScored}
    });

    const update = (delta: number) => {
        collectors.update(delta);
        droppers.update(delta);
        scent.update(delta);
        boids.update(delta);
    };

    const time = {speed: 1} as ITime;
    timeVariableLoop(time, update);
}

const colors = {top: 0x0000ff, bottom: 0x00ff00};

function App() {
    const canvasRef = useRef(null as HTMLDivElement | null);
    const hudState = observable({top: 0, bottom: 0, colors});
    useEffect(() => {
        canvasRef.current && initialize(canvasRef.current, hudState);
    }, [canvasRef]);
    return (
        <div ref={canvasRef}>
            <Hud {...{data: hudState}} />
        </div>
    );
}

export default App;
