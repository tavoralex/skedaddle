import React, {useState, useEffect} from "react";

export const Button = (p: {
    title: string;
    onClick: () => void;
    colors?: {default: string; hover: string; down: string};
    style?: any;
    textStyle?: any;
    children?: any;
}) => {
    const styleDefault = {
        minWidth: "300px",
        height: "60px",
        backgroundColor: p.colors ? p.colors.default : "#ffff80",
        display: "grid",
        transition: "all 0.15s ease-in",
        ...p.style
    };
    const [isDown, setisDown] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [style, setStyle] = useState(styleDefault);
    useEffect(() => {
        if (isDown) {
            setStyle({...styleDefault, backgroundColor: p.colors ? p.colors.down : "green"});
            return;
        }
        if (isHover) {
            setStyle({...styleDefault, backgroundColor: p.colors ? p.colors.hover : "lightgrey"});
            return;
        }
        setStyle(styleDefault);
    }, [isDown, isHover]);

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => {
                setIsHover(false);
                setisDown(false);
            }}
            onMouseDown={() => setisDown(true)}
            onMouseUp={() => setisDown(false)}
            onTouchStart={() => setisDown(true)}
            onTouchEnd={() => setisDown(false)}
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
                    fontSize: "28pt",
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
