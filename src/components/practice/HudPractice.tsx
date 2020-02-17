import React, {useState, useEffect, useCallback} from "react";
import {GameState, GAME_STATE} from "../types";
import {hexValueToString} from "utils/colorConversions";
import {autorun} from "mobx";
import {Button} from "components/common/Button";
import {PracticeOver} from "./PracticeOver";
import {isMobile} from "react-device-detect";

const fontStyle = {
    textShadow: "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
    position: "fixed" as "fixed",
    fontSize: "34pt"
};

export const HudPractice = (p: {data: GameState}) => {
    const {data} = p;
    const [topValue, settopValue] = useState(p.data.score.top);

    const onBackKeyDown = useCallback(() => {
        p.data.gameState = GAME_STATE.intro;
    }, []);

    useEffect(() => {
        document.addEventListener("backbutton", onBackKeyDown, true);
        return () => {
            document.removeEventListener("backbutton", onBackKeyDown, false);
        };
    }, []);

    useEffect(() => {
        return autorun(() => settopValue(p.data.score.top));
    }, [p.data.score.top]);

    const [topFillbarValue, settopFillbarValue] = useState(p.data.fillbars.top / p.data.fillbars.max);

    useEffect(() => {
        return autorun(() => settopFillbarValue(p.data.fillbars.top / p.data.fillbars.max));
    }, []);
    const [isGameOver, setisGameOver] = useState(p.data.isGameOver);

    useEffect(() => {
        return autorun(() => setisGameOver(p.data.isGameOver));
    }, []);
    const getStringVal = (v: number) => (v > 9 ? v : `0${v}`);
    const maxWidth = window.innerWidth - 100;
    const topColor = hexValueToString(data.colors.top);
    return (
        <div>
            {isGameOver && <PracticeOver {...{data}} />}
            <div
                style={{
                    ...fontStyle,
                    pointerEvents: "none",
                    opacity: 0.75,
                    top: "25%",
                    textAlign: "center",
                    color: topColor,
                    width: "100%"
                }}>
                {getStringVal(topValue)}
            </div>
            <div
                style={{
                    position: "fixed",
                    top: 8,
                    height: 16,
                    left: 50 + (maxWidth - maxWidth * topFillbarValue) / 2,
                    width: topFillbarValue * maxWidth,
                    backgroundColor: topColor
                }}
            />
            {!isGameOver && !isMobile && (
                <Button
                    {...{
                        title: "BACK",
                        onClick: () => {
                            console.log("BACK");
                            p.data.gameState = GAME_STATE.intro;
                        },
                        style: {
                            margin: "8px",
                            left: 0,
                            width: "calc(100% - 16px)",
                            height: "32px",
                            position: "fixed",
                            bottom: 0
                        },
                        textStyle: {fontSize: "16pt"}
                    }}
                />
            )}
        </div>
    );
};
