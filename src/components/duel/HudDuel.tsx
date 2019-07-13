import React, {useState, useEffect} from "react";
import {GameState} from "../types";
import {hexValueToString} from "utils/colorConversions";
import {autorun} from "mobx";
import {DuelOver} from "./DuelOver";

const fontStyle = {
    textShadow: "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
    position: "fixed" as "fixed",
    fontSize: "24pt"
};

export const HudDuel = (p: {data: GameState}) => {
    const {data} = p;
    const [bottomValue, setBottomValue] = useState(p.data.score.bottom);
    const [topValue, settopValue] = useState(p.data.score.top);
    useEffect(() => {
        return autorun(() => setBottomValue(p.data.score.bottom));
    }, [p.data.score.bottom]);
    useEffect(() => {
        return autorun(() => settopValue(p.data.score.top));
    }, [p.data.score.top]);

    const [bottomFillbarValue, setBottomFillbarValue] = useState(p.data.fillbars.bottom / p.data.fillbars.max);
    const [topFillbarValue, settopFillbarValue] = useState(p.data.fillbars.top / p.data.fillbars.max);
    useEffect(() => {
        return autorun(() => setBottomFillbarValue(p.data.fillbars.bottom / p.data.fillbars.max));
    }, [p.data.fillbars.bottom, p.data.fillbars.max]);
    useEffect(() => {
        return autorun(() => settopFillbarValue(p.data.fillbars.top / p.data.fillbars.max));
    }, [p.data.fillbars.top, p.data.fillbars.max]);

    const [isGameOver, setisGameOver] = useState(p.data.isGameOver);

    useEffect(() => {
        return autorun(() => setisGameOver(p.data.isGameOver));
    }, []);

    const getStringVal = (v: number) => (v > 9 ? v : `0${v}`);
    const maxWidth = window.innerWidth - 120;
    const topColor = hexValueToString(data.colors.top);
    const bottomColor = hexValueToString(data.colors.bottom);
    return (
        <div>
            {isGameOver && <DuelOver {...{data}} />}
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
            <div style={{...fontStyle, bottom: 4, right: 4, color: bottomColor}}>{getStringVal(bottomValue)}</div>
            <div
                style={{
                    position: "fixed",
                    bottom: 8,
                    height: 16,
                    right: 90,
                    width: bottomFillbarValue * maxWidth,
                    backgroundColor: bottomColor
                }}
            />
        </div>
    );
};
