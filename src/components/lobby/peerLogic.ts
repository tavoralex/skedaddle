import {LobbyState, PeerData, ConnectonResult} from "./../types";
import Peer from "peerjs";

export const peerLogic = (p: {
    state: LobbyState;
    onConnection: (data: ConnectonResult) => void;
    onData: (data: PeerData) => void;
}) => {
    const {state, onData, onConnection} = p;

    const peer = new Peer(state.ownId);

    const connectTo = async (id: string) => {
        return new Promise<ConnectonResult>((resolve, reject) => {
            state.status = "connecting";
            const conn = peer.connect(id);
            conn.on("open", () => {
                state.status = "connected";
                const send = conn.send.bind(conn);
                onConnection({send, peer: conn.peer});
                conn.on("data", onData);
                resolve({send, peer: conn.peer});
            });
        });
    };

    peer.on("connection", conn => {
        state.status = "connected";
        const send = conn.send.bind(conn);
        onConnection({send, peer: conn.peer});
        conn.on("data", onData);
    });

    return connectTo;
};
