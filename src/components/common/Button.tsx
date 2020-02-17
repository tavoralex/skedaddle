import React, {useState, useEffect} from "react";

export const Button = (p: {
    title: string;
    onClick?: () => void;
    colors?: {default: string; hover: string; down: string};
    style?: any;
    textStyle?: any;
    children?: any;
    disabled?: boolean;
}) => {
    const styleDefault = {
        width: "280px",
        height: "60px",
        backgroundColor: p.colors ? p.colors.default : "#ffff80",
        display: "grid",
        transition: "all 0.15s ease-in",
        ...p.style
    };
    const [isDown, setisDown] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [style, setStyle] = useState({...styleDefault});
    const colorDown = p.colors ? p.colors.down : "green";
    const colorHover = p.colors ? p.colors.hover : "lightgrey";

    useEffect(() => {
        if (p.disabled) {
            setStyle({...styleDefault, color: "darkgrey", backgroundColor: "lightgrey", pointerEvents: "none"});
            return;
        } else if (isDown) {
            setStyle({...styleDefault, backgroundColor: colorDown});
            return;
        } else if (isHover) {
            setStyle({...styleDefault, backgroundColor: colorHover});
            return;
        } else setStyle({...styleDefault});
    }, [isDown, isHover, p.disabled]);

    const onMouseEnter = () => setIsHover(true);
    const onMouseLeave = () => {
        setIsHover(false);
        setisDown(false);
    };
    const onMouseDown = () => setisDown(true);
    const onMouseUp = () => setisDown(false);
    const onTouchStart = () => setisDown(true);
    const onTouchEnd = () => setisDown(false);
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={p.onClick}
            style={style}>
            <div
                style={{
                    color: "black",
                    gridRow: 1,
                    gridColumn: 1,
                    alignSelf: "center",
                    justifySelf: "center",
                    fontWeight: 600,
                    fontSize: "16pt",
                    padding: "8px",
                    userSelect: "none",
                    ...p.textStyle
                }}>
                {p.title}
            </div>
            {p.children}
        </div>
    );
};
