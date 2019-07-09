import React, {useState, useEffect} from "react";
import {HudState} from "./types";
import {hexValueToString} from "utils/colorConversions";
import {autorun} from "mobx";

const fontStyle = {
    textShadow: "-1px -1px 0 #ffffff,1px -1px 0 #ffffff,-1px 1px 0 #ffffff,1px 1px 0 #ffffff",
    position: "fixed" as "fixed",
    fontSize: "24pt"
};

export const Hud = (p: {data: HudState}) => {
    const {data} = p;
    const [bottomValue, setBottomValue] = useState(p.data.bottom);
    const [topValue, settopValue] = useState(p.data.top);
    useEffect(() => {
        return autorun(() => setBottomValue(p.data.bottom));
    }, [p.data.bottom]);
    useEffect(() => {
        return autorun(() => settopValue(p.data.top));
    }, [p.data.top]);
    return (
        <div>
            <div style={{...fontStyle, top: 4, left: 4, color: hexValueToString(data.colors.top)}}>{topValue}</div>
            <div style={{...fontStyle, bottom: 4, right: 4, color: hexValueToString(data.colors.bottom)}}>
                {bottomValue}
            </div>
        </div>
    );
};
