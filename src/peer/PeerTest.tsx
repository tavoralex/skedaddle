import React, {useState} from "react";
import Peer from "peerjs";
import {uuid} from "../utils/uuid";

export const PeerTest = () => {
    const peer = new Peer(uuid());
    const [state, setState] = useState({text: "AWIATING INPUT", id: peer.id, target: ""});

    peer.on("connection", conn => {
        conn.on("data", data => {
            setState({...state, text: `MESSAGE RECEIVED: ${data}`});
        });
    });

    const connectTo = (id: string) => {
        const conn = peer.connect(id);
        // setState({...state, text: `CONNECTING TO ${id}`});
        conn.on("open", () => {
            setState({...state, text: `MESSAGE DISPATCHED TO ${id}`});
            conn.send("hi!");
        });
    };

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "grid",
                gridTemplateRows: "20% 1fr 20%",
                gridTemplateColumns: "20% 1fr 20%"
            }}>
            <div style={{gridRow: 1, gridColumn: 1, alignSelf: "center", justifySelf: "center", fontWeight: 600}}>
                {`MY ID IS: ${state.id}`}
            </div>
            <div style={{gridRow: 1, gridColumn: 2, alignSelf: "center", justifySelf: "center"}}>{state.text}</div>
            <div style={{gridRow: 2, gridColumn: 1, alignSelf: "center", justifySelf: "center"}}>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        connectTo(state.target);
                    }}>
                    <label>
                        Send to:
                        <input
                            type="text"
                            value={state.target}
                            onChange={e => {
                                setState({...state, target: e.currentTarget.value});
                            }}
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
};
