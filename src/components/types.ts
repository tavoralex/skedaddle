import {ITime} from "utils/loop/timeVariableLoop";

export enum GAME_STATE {
    "intro" = "intro",
    "duel" = "duel",
    "practice" = "practice",
    "about" = "about"
}

export type GameState = {
    gameState: GAME_STATE;
    score: {top: number; bottom: number};
    colors: {top: number; bottom: number};
    fillbars: {max: number; top: number; bottom: number};
    actions: {reset?: () => void; startGame?: () => void; endGame?: () => void};
    time: ITime;
    duration: number;
    maxDuration: number;
    isGameOver: boolean;
};
