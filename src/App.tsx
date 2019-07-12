import React, {useRef, useEffect} from "react";
import timeVariableLoop, {ITime} from "utils/loop/timeVariableLoop";
import {makeCollectors} from "game/makeCollectors";
import {GameState, GAME_STATE} from "components/types";
import {observable, autorun, action} from "mobx";
import {makeScentDroppers} from "./game/init/makeScentDroppers";
import {makeBoids, populateBoids} from "./game/init/makeBoids";
import {makeAvoidScent} from "./game/init/makeAvoidScent";
import {makeMap} from "./game/init/makeMap";
import {makeFillbars} from "game/makeFillbars";
import {Hud} from "components/Hud";
import {TimeCountdown} from "components/duel/TimeCountdown";

/*
  TODO
    * fillbar
        * spend rate
        * refill rate
    proper ui
        * game screen (hud)
        * before game screen
        * screens management
        * practice screen
            * hud
               *  with back button
                * without opponent stuff
        * duel screen
        * game over detection
        * game over screens
            * practice
            * duel
    * game time counter
    * moar colors
    peer connection
        matchmaking screen
        pass data
            scent dropped event with node
    solve bug where boids get stuck in walls
    solve bug where switching tab and returning messes boids positions up
*/

function initialize(gameCanvas: HTMLDivElement, gameState: GameState) {
    const onTopScored = () => {
        gameState.score.top += 1;
    };
    const onBottomScored = () => {
        gameState.score.bottom += 1;
    };
    const map = makeMap(gameCanvas);
    const scent = makeAvoidScent(map);
    const boids = makeBoids(map, scent.data);
    const collectors = makeCollectors({
        display: map.display,
        grid: map.grid,
        boids,
        colors,
        actions: {onTopScored, onBottomScored}
    });
    const fillbars = makeFillbars(gameState.fillbars);
    const droppers = makeScentDroppers(map, scent.data, fillbars);

    const update = (delta: number) => {
        collectors.update(delta);
        droppers.update(delta);
        scent.update(delta);
        boids.update(delta);
        fillbars.update(delta);
        gameState.duration += delta;
    };

    timeVariableLoop(gameState.time, update);

    const reset = () => {
        scent.data.scentGrid.forEach((v, i) => (scent.data.scentGrid[i] = 0));
        droppers.droppers.updates = [];
        boids.reset();
        gameState.score.top = 0;
        gameState.score.bottom = 0;
        fillbars.bars.top = fillbars.bars.max;
        fillbars.bars.bottom = fillbars.bars.max;
        populateBoids(boids);
    };
    gameState.actions.reset = reset;
}

const colors = {top: 0x80ff80, bottom: 0xff8080};

function App() {
    const canvasRef = useRef(null as HTMLDivElement | null);
    const gameState = observable({
        gameState: GAME_STATE.intro,
        score: {top: 0, bottom: 0},
        fillbars: {max: 100, top: 100, bottom: 100},
        colors,
        duration: 0,
        maxDuration: 30,
        actions: {},
        time: {speed: 1},
        isGameOver: false
    }) as GameState;

    const endGame = action(() => {
        gameState.time.speed = 0;
        gameState.isGameOver = true;
    });
    const startGame = action(() => {
        gameState.actions.reset && gameState.actions.reset();
        gameState.time.speed = 1;
        gameState.duration = gameState.gameState === GAME_STATE.duel ? 0 : gameState.maxDuration;
        gameState.isGameOver = false;
    });

    gameState.actions.endGame = endGame;
    gameState.actions.startGame = startGame;

    useEffect(() => {
        canvasRef.current && initialize(canvasRef.current, gameState);
    }, [canvasRef]);

    useEffect(() => {
        return autorun(() => {
            gameState.score.bottom + gameState.score.top >= 33 && endGame();
        });
    }, []);
    useEffect(() => {
        return autorun(
            () =>
                (gameState.gameState === GAME_STATE.practice || gameState.gameState === GAME_STATE.duel) && startGame()
        );
    }, []);
    return (
        <div style={{position: "relative", backgroundColor: "black", width: "100vw", height: "100vh"}}>
            <TimeCountdown {...{data: gameState}} />
            <div style={{position: "fixed"}} ref={canvasRef} />
            <Hud {...{gameState}} />
        </div>
    );
}

export default App;
