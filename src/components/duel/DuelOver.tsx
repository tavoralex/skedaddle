import React from "react";
import {Button} from "components/common/Button";
import {GameState, GAME_STATE} from "components/types";

export const DuelOver = (p: {data: GameState}) => {
    const {data} = p;
    return (
        <div
            style={{
                height: `${window.innerHeight}px`,
                width: `${window.innerWidth}px`,
                display: "grid",
                gridTemplateRows: "1fr 1fr 1fr",
                gridTemplateColumns: "1fr"
            }}>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center",
                    fontWeight: 600,
                    color: "red",
                    fontSize: "28pt"
                }}>
                {`GAME OVER`}
            </div>
            <div
                style={{
                    gridRow: 2,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center"
                }}>
                <Button
                    {...{
                        title: "AGAIN!",
                        onClick: () => {
                            data.actions.startGame && data.actions.startGame();
                        }
                    }}
                />
            </div>
            <div
                style={{
                    gridRow: 3,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center"
                }}>
                <Button
                    {...{
                        title: "BACK",
                        onClick: () => {
                            data.actions.reset && data.actions.reset();
                            data.gameState = GAME_STATE.lobby;
                        }
                    }}
                />
            </div>
        </div>
    );
};
