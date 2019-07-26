import timeVariableLoop from "utils/loop/timeVariableLoop";
import {makeCollectors} from "game/makeCollectors";
import {GameState} from "components/types";
import {makeScentDroppers} from "./makeScentDroppers";
import {makeBoids, populateBoids} from "./makeBoids";
import {makeAvoidScent} from "./makeAvoidScent";
import {makeMap} from "./makeMap";
import {makeFillbars} from "game/makeFillbars";
import {GridBoids} from "boids/GridBoids";

const makeSyncPeers = (
    gameState: GameState,
    droppers: {dropFromPeer: (nodes: number[]) => void},
    boids: GridBoids
) => () => {
    const ls = gameState.lobbyState;
    if (!ls) return;
    if (ls.otherPeerData.nodesTouched && ls.otherPeerData.nodesTouched.length) {
        droppers.dropFromPeer(ls.otherPeerData.nodesTouched);
        ls.otherPeerData.nodesTouched = [] as number[];
    }
    if (ls.ownPeerData.isOP) {
        ls.ownPeerData.isGameOver = gameState.isGameOver;
        ls.ownPeerData.score = {...gameState.score};
        ls.ownPeerData.boids = boids.boids.map(boid => ({
            position: {x: boid.position.x, y: boid.position.y},
            velocity: boid.velocity
        }));
    } else {
        const isOtherGameOver = Boolean(ls.otherPeerData.isGameOver);
        if (gameState.isGameOver && !isOtherGameOver) {
            gameState.actions.startGame();
        } else if (!gameState.isGameOver && isOtherGameOver) {
            gameState.actions.endGame();
        }
        if (ls.otherPeerData.score) {
            gameState.score.top = ls.otherPeerData.score.top;
            gameState.score.bottom = ls.otherPeerData.score.bottom;
        }
        // sync boids
        if (!gameState.isGameOver && ls.otherPeerData.boids && ls.otherPeerData.boids.length) {
            while (ls.otherPeerData.boids.length > boids.boids.length) {
                const maxIndex = boids.boids.length;
                const peerBoid = ls.otherPeerData.boids[maxIndex];
                boids.addBoid(peerBoid.position);
            }
            ls.otherPeerData.boids.forEach((b, i) => {
                if (boids.boids.length <= i) {
                    boids.boids.pop();
                    return;
                }
                boids.syncBoid(b, i);
            });
        }
    }
    if (ls.ownPeerData.isOP || (ls.ownPeerData.nodesTouched && ls.ownPeerData.nodesTouched.length)) {
        ls.send && ls.send(ls.ownPeerData);
        ls.ownPeerData.nodesTouched = [] as number[];
    }
};
export function initialize(gameCanvas: HTMLDivElement, gameState: GameState) {
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
        colors: gameState.colors,
        actions: {onTopScored, onBottomScored}
    });
    const fillbars = makeFillbars(gameState.fillbars);
    const droppers = makeScentDroppers(gameState, map, scent.data, fillbars);
    const syncPeers = makeSyncPeers(gameState, droppers, boids);

    const update = (delta: number) => {
        collectors.update(delta);
        droppers.update(delta);
        scent.update(delta);
        boids.update(delta);
        fillbars.update(delta);
        gameState.duration += delta;
        syncPeers();
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
