import {IPoint} from "./../utils/geom";
import {makeBoid} from "./makeBoid";

export interface IBoid {
    position: IPoint;
    velocity: IPoint;
    drag: number;
    speed: number;
    thrust: number;
    radius: number;
}

export function makeBoids(numBoids: number, template?: any) {
    return Array.from({length: numBoids}, n => makeBoid(template));
}
