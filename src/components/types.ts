import {IBoid} from "./../boids/makeBoids";
import {ITime} from "utils/loop/timeVariableLoop";
import {string} from "prop-types";

export enum GAME_STATE {
    "intro" = "intro",
    "duel" = "duel",
    "practice" = "practice",
    "about" = "about",
    "lobby" = "lobby"
}

export type LobbyStatus = "peerless" | "connecting" | "connected" | "awaiting-peer-ready";
export type ConnectonResult = {send: (data: PeerData) => void; peer: string};
export type LobbyState = {
    peer: string;
    ownId: string;
    status: LobbyStatus;
    ownPeerData: PeerData;
    otherPeerData: PeerData;
    connectTo?: (id: string) => Promise<ConnectonResult>;
    send?: (data: PeerData) => void;
};

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
    lobbyState?: LobbyState;
};

export type PeerBoid = IBoid & {node: number};

export type PeerData = {
    isOP?: boolean;
    isReady?: boolean;
    nodesTouched?: number[];
    boids?: PeerBoid[];
    timeLeft?: number;
};
