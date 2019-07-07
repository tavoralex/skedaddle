import {IScent} from "./types";

export default function changeScent(scent: IScent, index: number) {
    scent.scentGrid[index] = Math.max(0, scent.scentGrid[index] + scent.quantity);
}
