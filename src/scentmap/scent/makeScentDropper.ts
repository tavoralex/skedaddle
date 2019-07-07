import {IScent} from "./types";

export default function makeScentDropper(scent: IScent, index: number, seconds: number = 0) {
    let elapsed = 0;
    const dropScent = (delta: number) => {
        elapsed += delta;
        scent.scentGrid[index] = Math.max(0, scent.scentGrid[index] + scent.quantity);
        return elapsed < seconds;
    };
    return dropScent;
}
