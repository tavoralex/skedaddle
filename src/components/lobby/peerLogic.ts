import {LobbyState, PeerData, ConnectonResult} from "./../types";
import Peer from "peerjs";

export const peerLogic = (p: {
    state: LobbyState;
    onConnection: (data: ConnectonResult) => void;
    onData: (data: PeerData) => void;
}) => {
    const {state, onData, onConnection} = p;

    let isConnected = false;
    let onConnected: () => void;
    const peer = new Peer(state.ownId);

    peer.on("connection", conn => {
        state.status = "connected";
        const send = conn.send.bind(conn);
        onConnection({send, peer: conn.peer});
        conn.on("data", onData);
    });

    peer.on("open", () => {
        isConnected = true;
        onConnected && onConnected();
    });

    const connectTo = async (id: string) => {
        state.status = "connecting";
        const connectionResult = await new Promise<ConnectonResult>((resolve, reject) => {
            const addOnConnect = () => {
                const conn = peer.connect(id);
                conn.on("open", () => {
                    state.status = "connected";
                    const send = conn.send.bind(conn);
                    onConnection({send, peer: conn.peer});
                    conn.on("data", onData);
                    resolve({send, peer: conn.peer});
                });
            };
            isConnected ? addOnConnect() : (onConnected = addOnConnect);
        });
        state.ownPeerData.isOP = true;
        state.peer = connectionResult.peer;
        state.send = connectionResult.send;
        state.status = "awaiting-peer-ready";
        state.send({isReady: true});
    };

    return connectTo;
};
