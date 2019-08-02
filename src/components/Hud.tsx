import React, {useRef, useEffect, useState} from "react";
import {HudPractice} from "components/practice/HudPractice";
import {GAME_STATE} from "components/types";
import {GameState} from "./types";
import {HudDuel} from "./duel/HudDuel";
import {IntroScreen} from "./intro/IntroScreen";
import {autorun} from "mobx";
import {About} from "./info/About";
import {Lobby} from "./lobby/Lobby";

export const Hud = (p: {gameState: GameState}) => {
    let hud;
    const [gameState, setgameState] = useState(p.gameState.gameState);

    useEffect(() => {
        return autorun(() => setgameState(p.gameState.gameState));
    }, []);
    switch (gameState) {
        case GAME_STATE.practice:
            hud = <HudPractice {...{data: p.gameState}} />;
            break;
        case GAME_STATE.duel:
            hud = <HudDuel {...{data: p.gameState}} />;
            break;
        case GAME_STATE.intro:
            hud = <IntroScreen {...{data: p.gameState}} />;
            break;
        case GAME_STATE.about:
            hud = <About {...{data: p.gameState}} />;
            break;
        case GAME_STATE.lobby:
            hud = <Lobby {...{data: p.gameState}} />;
            break;
        default:
            break;
    }
    return <div style={{position: "fixed"}}>{hud}</div>;
};
