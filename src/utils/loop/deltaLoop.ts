import {animationLoop} from "./animationLoop";

let current = Date.now();

export default function deltaLoop(callback: (delta: number) => void) {
    const loop = () => {
        const nc = Date.now();
        const delta = (nc - current) / 1000;
        current = nc;
        callback(delta);
    };
    animationLoop(loop);
}
