import React, {useState, useEffect, useRef} from "react";
import {Button} from "components/common/Button";
import {GameState, GAME_STATE} from "components/types";
import {getLobbyState} from "./getLobbyState";
import {autorun} from "mobx";
import {ActionButton} from "./ActionButton";
import {copyToClipboard} from "components/duel/copyToClipboard";

const textStyle = {
    gridColumn: 1,
    placeSelf: "center center",
    fontWeight: 400,
    color: "white",
    fontSize: "16pt",
    textAlign: "center" as "center",
    whiteSpace: "pre-line" as "pre-line",
    paddingRight: "8px",
    paddingLeft: "8px",
    paddingBottom: "8px"
};

const rowStyle = (gridRow: number = 1) => ({
    height: "100%",
    gridRow,
    gridColumn: 1,
    placeSelf: "center center",
    display: "grid"
});

export const Lobby = (p: {data: GameState}) => {
    const {data} = p;
    const state = getLobbyState(p.data);
    const [friendKey, setfriendKey] = useState(state.peer);
    useEffect(() => {
        return autorun(() => {
            setfriendKey(state.peer);
        });
    }, []);

    const [status, setStatus] = useState(state.status);
    useEffect(() => {
        return autorun(() => {
            setStatus(state.status);
        });
    }, []);

    return (
        <div
            style={{
                height: `${window.innerHeight}px`,
                width: `${window.innerWidth}px`,
                display: "grid",
                gridTemplateRows: "1fr 1fr 1fr 1fr 1fr",
                gridTemplateColumns: "1fr",
                backgroundColor: "black"
            }}>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    placeSelf: "center center",
                    fontWeight: 600,
                    color: "#80c0ff",
                    textShadow: "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                    fontSize: "32pt"
                }}>
                {`LOBBY`}
            </div>
            <div style={rowStyle(2)}>
                <div style={textStyle} onClick={() => copyToClipboard(state.ownId)}>
                    <div style={{color: "#80ff80"}}>{`Your key, tap to copy it`}</div>
                    <div style={{paddingTop: "32px"}}>{state.ownId}</div>
                </div>
            </div>
            <div style={rowStyle(3)}>
                <div
                    style={{...textStyle, color: "#80ff80"}}
                    onClick={() =>
                        navigator.clipboard.readText().then(clipText => setfriendKey(clipText))
                    }>{`Tap to paste key from clipboard`}</div>
            </div>
            <div style={rowStyle(4)}>
                <input
                    type="text"
                    onChange={e => setfriendKey(e.target.value)}
                    value={friendKey}
                    style={{...textStyle, color: "black", height: "32px", width: "340px"}}
                />
                {ActionButton({data, friendKey, status})}
            </div>
            <div style={rowStyle(5)}>
                <Button
                    {...{
                        style: {placeSelf: "center center"},
                        title: "BACK",
                        onClick: () => {
                            data.gameState = GAME_STATE.intro;
                        }
                    }}
                />
            </div>
        </div>
    );
};
