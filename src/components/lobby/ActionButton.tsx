import React, {useState, useEffect} from "react";
import {Button} from "components/common/Button";
import {GameState, GAME_STATE, LobbyStatus} from "components/types";
import {getLobbyState} from "./getLobbyState";
import {action, autorun} from "mobx";
export const ActionButton = (p: {data: GameState; friendKey: string; status: LobbyStatus}) => {
    const {data, friendKey, status} = p;
    const state = getLobbyState(data);
    useEffect(() => {
        return autorun(() => {
            state.otherPeerData.isReady && state.status === "awaiting-peer-ready" && (data.gameState = GAME_STATE.duel);
        });
    }, []);
    let reply = null;
    switch (status) {
        case "peerless":
            reply = (
                <Button
                    style={{marginTop: "32px", placeSelf: "center center"}}
                    {...{
                        disabled: !Boolean(friendKey),
                        title: "JOIN",
                        onClick: action(async () => {
                            state.connectTo && state.connectTo(friendKey);
                        })
                    }}
                />
            );
            break;
        case "connecting":
            reply = (
                <Button
                    style={{marginTop: "32px", placeSelf: "center center"}}
                    {...{
                        disabled: true,
                        title: "CONNECTING"
                    }}
                />
            );
            break;
        case "connected":
            reply = (
                <Button
                    style={{marginTop: "32px", placeSelf: "center center"}}
                    {...{
                        title: "DUEL!",
                        onClick: async () => {
                            if (state.connectTo) {
                                console.log(state.send ? "sending is ready true" : "no send found");
                                state.send && state.send({isReady: true});
                                data.gameState = GAME_STATE.duel;
                            }
                        }
                    }}
                />
            );
            break;
        case "awaiting-peer-ready":
            reply = (
                <Button
                    style={{marginTop: "32px", placeSelf: "center center"}}
                    {...{
                        disabled: true,
                        title: "WAITING"
                    }}
                />
            );
            break;
        default:
            break;
    }
    return reply;
};
