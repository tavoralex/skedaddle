import deltaLoop from "./deltaLoop";

export interface ITime {
    speed: number;
}

export default function timeVariableLoop(time: ITime, callback: (delta: number) => void) {
    const loop = (d: number) => {
        callback(d * time.speed);
    };
    deltaLoop(loop);
}
