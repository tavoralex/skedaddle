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
                gridTemplateRows: "100px 1fr 1fr 1fr 1fr",
                gridTemplateColumns: "1fr",
                backgroundColor: "black"
            }}>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    alignSelf: "end",
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
                        fontSize: "16pt",
                        textAlign: "center",
                        whiteSpace: "pre-line",
                        paddingLeft: "8px",
                        paddingRight: "8px"
                    }}>
                    {`a 2-player game by 
                    `}
                    <span style={{fontSize: "24pt", color: "#80ff80"}}>{`Alex Tavor`}</span>
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
                        whiteSpace: "pre-line",
                        paddingRight: "8px",
                        paddingLeft: "8px"
                    }}>
                    {`Duel by pushing things up with your finger!`}
                </div>
            </div>
            <div
                style={{
                    gridRow: 4,
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
                        whiteSpace: "pre-line",
                        paddingRight: "8px",
                        paddingLeft: "8px"
                    }}>
                    {`Tell your friends!`}
                </div>
            </div>
            <div
                style={{
                    gridRow: 5,
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
