import {GridMap} from "types";
import {IScent} from "scentmap/scent/types";
import {addDropFunctionality} from "game/addDropFunctionality";
import makeScentDropper from "scentmap/scent/makeScentDropper";
import {IDroppers} from "./IDroppers";
import {GameState} from "components/types";

const minDrop = 0.2;
const minTap = 0.001;

export const makeScentDroppers = (
    gameState: GameState,
    map: GridMap,
    scent: IScent,
    fillbars: {bars: {max: number; top: number; bottom: number}}
) => {
    const droppers: IDroppers = {updates: []};
    let isDropping = false;
    let lastDelta = 0;
    const dropOwn = (node: number) => {
        droppers.updates.push(makeScentDropper(scent, node, scent.seconds));
        fillbars.bars.top -= 1;
        const ls = gameState.lobbyState;
        if (ls) {
            ls.ownPeerData.nodesTouched && ls.ownPeerData.nodesTouched.push(node);
        }
    };
    const onDrag = (node: number) => {
        onStart();

        if (lastDelta && isDropping && fillbars.bars.top > 0) {
            dropOwn(node);
            fillbars.bars.top <= 0 && (isDropping = false);
        }
    };
    const onTap = (node: number) => {
        if (lastDelta && fillbars.bars.top / fillbars.bars.max >= minTap) {
            dropOwn(node);
        }
    };
    const onStart = () => {
        const fill = fillbars.bars.top / fillbars.bars.max;
        lastDelta && fill >= minDrop && (isDropping = true);
    };

    const onEnd = () => {
        isDropping = false;
    };
    addDropFunctionality(map.display, map.grid, onDrag, onTap, onStart, onEnd);
    const update = (delta: number) => {
        lastDelta = delta;
        droppers.updates = droppers.updates.filter(update => update(delta));
    };

    const dropFromPeer = (nodes: number[]) => {
        nodes.forEach(node => {
            droppers.updates.push(makeScentDropper(scent, node, scent.seconds));
            fillbars.bars.bottom -= 1;
        });
    };

    return {update, droppers, dropFromPeer};
};
