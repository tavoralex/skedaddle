import React, {useState, useEffect} from "react";
import {GameState, GAME_STATE} from "components/types";
import {autorun} from "mobx";

export const TimeCountdown = (p: {data: GameState}) => {
    const [isGameOver, setisGameOver] = useState(p.data.isGameOver);
    useEffect(() => {
        return autorun(() => setisGameOver(p.data.isGameOver));
    }, [p.data.isGameOver]);
    const [isTimed, setisTimed] = useState(p.data.gameState === GAME_STATE.duel);
    useEffect(() => {
        return autorun(() => setisTimed(p.data.gameState === GAME_STATE.duel));
    }, [p.data.gameState]);

    const tLeft = Math.ceil(p.data.maxDuration - p.data.duration);
    const [secondsLeft, setsecondsLeft] = useState(Math.max(0, tLeft));

    useEffect(() => {
        return autorun(() => {
            if (!isTimed || isGameOver) return;
            const tLeft = Math.ceil(p.data.maxDuration - p.data.duration);
            setsecondsLeft(Math.max(0, tLeft));

            if (tLeft <= 0) {
                p.data.actions.endGame && p.data.actions.endGame();
            }
        });
    }, [isTimed, isGameOver]);
    return !isTimed || isGameOver ? null : (
        <div
            style={{
                position: "absolute",
                height: `${window.innerHeight}px`,
                width: `${window.innerWidth}px`,
                display: "grid",
                gridTemplateRows: "1fr",
                gridTemplateColumns: "1fr",
                pointerEvents: "none",
                touchAction: "none"
            }}>
            <div
                style={{
                    alignSelf: "center",
                    justifySelf: "center",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#ffff80",
                    fontSize: "64pt",
                    pointerEvents: "none",
                    touchAction: "none"
                }}>
                {secondsLeft}
            </div>
        </div>
    );
};
