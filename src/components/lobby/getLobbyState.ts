import {seed} from "./../../utils/simplexNoise";
import {LobbyState, PeerData, ConnectonResult} from "./../types";
import {GameState, LobbyStatus} from "../types";
import {observable, action} from "mobx";
import {uuid} from "utils/uuid";
import {peerLogic} from "./peerLogic";

export const getLobbyState = (gameState: GameState) => {
    if (!gameState.lobbyState) {
        const lobbyState = observable({
            peer: "",
            status: "peerless" as LobbyStatus,
            ownId: uuid(),
            ownPeerData: {isReady: false, nodesTouched: []},
            otherPeerData: {isReady: false, nodesTouched: []}
        }) as any;
        const connectTo = peerLogic({
            state: lobbyState,
            onConnection: (d: ConnectonResult) => {
                lobbyState.peer = d.peer;
                lobbyState.send = d.send;
            },
            onData: action((d: PeerData) => {
                lobbyState.otherPeerData.isReady = d.isReady;
                lobbyState.otherPeerData.nodesTouched = d.nodesTouched;
                lobbyState.otherPeerData.boids = d.boids;
            })
        });
        lobbyState.connectTo = connectTo;
        gameState.lobbyState = lobbyState as LobbyState;
    }
    return gameState.lobbyState;
};
