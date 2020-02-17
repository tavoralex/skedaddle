import React, {useState, useEffect} from "react";
import {GameState, GAME_STATE} from "components/types";
import {autorun} from "mobx";
import {Button} from "components/common/Button";

export const IntroScreen = (p: {data: GameState}) => {
    const {data} = p;
    const [isVisible, setisVisible] = useState(data.gameState === GAME_STATE.intro);

    useEffect(() => {
        return autorun(() => {
            (data.gameState === GAME_STATE.intro) !== isVisible && setisVisible(data.gameState === GAME_STATE.intro);
        });
    }, [data.gameState]);

    return !isVisible ? null : (
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
                    fontSize: "28pt"
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
                <Button
                    {...{
                        title: "PRACTICE",
                        onClick: () => {
                            data.gameState = GAME_STATE.practice;
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
                        title: "DUEL!",
                        onClick: () => {
                            data.gameState = GAME_STATE.lobby;
                        }
                    }}
                />
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
                        title: "WHAT?",
                        onClick: () => {
                            data.gameState = GAME_STATE.about;
                        }
                    }}
                />
            </div>
        </div>
    );
};
