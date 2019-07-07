import {subtractVector, normalize, multiplyScalar, clamp, rotateVector} from "../../utils/geom";
import {IBoid} from "../makeBoids";

export function wander(boid: IBoid, angle: number) {
    const steer = rotateVector({...boid.velocity}, angle);
    normalize(steer);
    multiplyScalar(steer, boid.speed);
    subtractVector(steer, boid.velocity);
    clamp(steer, boid.thrust);
    return steer;
}
