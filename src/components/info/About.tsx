import React from "react";
import {GameState, GAME_STATE} from "components/types";
import {Button} from "components/common/Button";

export const About = (p: {data: GameState}) => {
    return (
        <div
            style={{
                height: `${window.innerHeight}px`,
                width: `${window.innerWidth}px`,
                display: "grid",
                gridTemplateRows: "1fr 1fr 1fr 1fr",
                gridTemplateColumns: "1fr",
                backgroundColor: "black"
            }}>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center",
                    fontWeight: 600,
                    color: "#80c0ff",
                    fontSize: "32pt"
                }}>
                {`SKEDADDLE`}
            </div>
            <div
                style={{
                    gridRow: 2,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center"
                }}>
                <div
                    style={{
                        gridRow: 1,
                        gridColumn: 1,
                        alignSelf: "center",
                        justifySelf: "center",
                        fontWeight: 400,
                        color: "white",
                        fontSize: "22pt",
                        textAlign: "center",
                        whiteSpace: "pre-line"
                    }}>
                    {`a 2-player game  

                    by Alex Tavor`}
                </div>
            </div>
            <div
                style={{
                    gridRow: 3,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center"
                }}>
                <div
                    style={{
                        gridRow: 1,
                        gridColumn: 1,
                        alignSelf: "center",
                        justifySelf: "center",
                        fontWeight: 400,
                        color: "white",
                        fontSize: "22pt",
                        textAlign: "center",
                        whiteSpace: "pre-line"
                    }}>
                    {`Tell your friends!`}
                </div>
            </div>
            <div
                style={{
                    gridRow: 4,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center"
                }}>
                <Button
                    {...{
                        title: "BACK",
                        onClick: () => {
                            p.data.gameState = GAME_STATE.intro;
                        }
                    }}
                />
            </div>
        </div>
    );
};
