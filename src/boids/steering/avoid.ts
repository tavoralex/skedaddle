import {subtractVector, normalize, multiplyScalar, clamp, IPoint} from "../../utils/geom";
import {IBoid} from "../makeBoids";
export function avoid(target: IPoint, boid: IBoid) {
    const d = subtractVector({...target}, boid.position);
    normalize(d);
    multiplyScalar(d, -boid.speed);
    subtractVector(d, boid.velocity);
    clamp(d, boid.thrust);
    return d;
}
