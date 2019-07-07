import {addVector, subtractVector, normalize, multiplyScalar, clamp, divideByScalar, IPoint} from "../../utils/geom";
import {IBoid} from "../makeBoids";

export function alignment(boid: IBoid, velocities: IPoint[]) {
    const steer = {x: 0, y: 0};
    const numNeighbors = velocities.length;
    if (!numNeighbors) return {x: 0, y: 0};
    for (let velocity of velocities) {
        addVector(steer, velocity);
    }
    divideByScalar(steer, numNeighbors);
    normalize(steer);
    multiplyScalar(steer, boid.speed);
    subtractVector(steer, boid.velocity);
    clamp(steer, boid.thrust);
    return steer;
}
