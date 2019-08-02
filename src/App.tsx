import React, {useRef, useEffect} from "react";
import {GameState, GAME_STATE} from "components/types";
import {observable, autorun, action} from "mobx";
import {Hud} from "components/Hud";
import {TimeCountdown} from "components/duel/TimeCountdown";
import {initialize} from "./game/init/initialize";
import {getLobbyState} from "components/lobby/getLobbyState";

/*
  TODO
    * fillbar
        * spend rate
        * refill rate
    proper ui
        * game screen (hud)
        * before game screen
        * screens management
        * practice screen
            * hud
               *  with back button
                * without opponent stuff
        * duel screen
        * game over detection
        * game over screens
            * practice
            * duel
    * game time counter
    * moar colors
    peer connection
        * matchmaking screen
        * find/await peer, make connection
        *  get mutual agreement to play
            * each has to click "READY"
        * pass data
            * use PeerData
                * get tap positions
                * update and dispatch every tick
        * solve sync
        * solve sync even better
        * better lobby
            * goto lobby and connect via url
        handle top/down players better
            give each player a unique color
                color selector in lobby
                row of colored buttons
                randomly select color
                show opponent color
            give each player a name
                name is written on their half of the board
        connection fail states
            disconnection
        better endgame screen for duel
    solve bug where boids get stuck in walls
    solve bug where switching tab and returning messes boids positions up
*/

function App() {
    const canvasRef = useRef(null as HTMLDivElement | null);
    const gameState = (observable({
        gameState: GAME_STATE.intro,
        score: {top: 0, bottom: 0},
        fillbars: {max: 100, top: 100, bottom: 100},
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
