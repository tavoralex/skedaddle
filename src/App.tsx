import React, {useRef, useEffect} from "react";
import {GameState, GAME_STATE} from "components/types";
import {observable, autorun, action} from "mobx";
import {Hud} from "components/Hud";
import {TimeCountdown} from "components/duel/TimeCountdown";
import {initialize} from "./game/init/initialize";
import {getLobbyState} from "components/lobby/getLobbyState";

/*
  TODO
    matchmaking
        server
            runs peerjs
            keeps list of connected users
            user id is a string of profile json
            heorku it for now
        lobby
            ...connecting modal
            list of waiting users
            toggle "waiting" status
            keepalive
                see if can keep peerjs connection alive
                poll at 10s interval
            inactivity timeout
            disconnected modal, with reconnect and exit buttons
        user settings
            user icon & name always visible
                random name from default to https://namey.muffinlabs.com/
                random icon from https://www.gravatar.com/avatar/[numeric id]?d=retro
                    where numeric id is randomInt(0,99999999999999999999999999999999)
        lobby 2
            clearer status
                have a log on screen 
                    awaiting connection
                        log is small
                    in connection
                        connecting
                        awaiting confirmation
                        requesting confirmation
                        confirmed, starting game
        user personalization
            user icon is clickable, leads to options screen
            options screen
                choose name
                choose color
                choose icon link            
        add name verification with server
    better ui
        better endgame screen for duel
        better in-game ui
    connection fail states
        disconnected from peer
        disconnected from serve
    solve bug where boids get stuck in walls
    solve bug where switching tab and returning messes boids positions up
*/

function App() {
    const canvasRef = useRef(null as HTMLDivElement | null);
    const gameState = (observable({
        gameState: GAME_STATE.intro,
        score: {top: 0, bottom: 0},
        fillbars: {max: 10, top: 10, bottom: 10},
        colors: {top: 0x80ff80, bottom: 0xff8080},
        duration: 0,
        maxDuration: 30,
        time: {speed: 1},
        isGameOver: true
    }) as any) as GameState;
    // @ts-ignore
    gameState.actions = {};
    const ls = getLobbyState(gameState);
    const endGame = action(() => {
        gameState.time.speed = 0;
        gameState.isGameOver = true;
    });
    const startGame = action(() => {
        gameState.isGameOver = false;
        gameState.actions.reset && gameState.actions.reset();
        gameState.time.speed = 1;
        gameState.duration = gameState.gameState === GAME_STATE.duel ? 0 : gameState.maxDuration;
    });

    gameState.actions.endGame = endGame;
    gameState.actions.startGame = startGame;

    useEffect(() => {
        canvasRef.current && initialize(canvasRef.current, gameState);
    }, [canvasRef]);

    useEffect(() => {
        return autorun(() => {
            gameState.score.bottom + gameState.score.top >= 33 && endGame();
        });
    }, []);

    useEffect(() => {
        return autorun(
            () =>
                (gameState.gameState === GAME_STATE.practice || gameState.gameState === GAME_STATE.duel) && startGame()
        );
    }, []);

    if (window.location.hash) {
        const autoConnect = () => {
            const peer = window.location.hash.substr(1);
            window.location.hash = "";
            ls.peer = peer;
            ls.connectTo && ls.connectTo(peer);
            gameState.gameState = GAME_STATE.lobby;
        };
        autoConnect();
    }
    return (
        <div style={{position: "relative", backgroundColor: "black", width: "100vw", height: "100vh"}}>
            <TimeCountdown {...{data: gameState}} />
            <div style={{position: "fixed"}} ref={canvasRef} />
            <Hud {...{gameState}} />
        </div>
    );
}

export default App;
