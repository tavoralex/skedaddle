import React, {useState, useEffect} from "react";
import {GameState, GAME_STATE} from "../types";
import {hexValueToString} from "utils/colorConversions";
import {autorun} from "mobx";
import {Button} from "components/common/Button";
import {PracticeOver} from "./PracticeOver";

const fontStyle = {
    textShadow: "-1px -1px 0 #ffffff,1px -1px 0 #ffffff,-1px 1px 0 #ffffff,1px 1px 0 #ffffff",
    position: "fixed" as "fixed",
    fontSize: "24pt"
};

export const HudPractice = (p: {data: GameState}) => {
    const {data} = p;
    const [topValue, settopValue] = useState(p.data.score.top);
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
    const maxWidth = window.innerWidth - 120;
    const topColor = hexValueToString(data.colors.top);
    return (
        <div>
            {isGameOver && <PracticeOver {...{data}} />}
            <div style={{...fontStyle, top: 4, left: 4, color: topColor}}>{getStringVal(topValue)}</div>
            <div
                style={{
                    position: "fixed",
                    top: 8,
                    height: 16,
                    left: 90,
                    width: topFillbarValue * maxWidth,
                    backgroundColor: topColor
                }}
            />
            {!isGameOver && (
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
