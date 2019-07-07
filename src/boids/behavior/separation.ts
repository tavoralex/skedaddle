import {
    addVector,
    subtractVector,
    normalize,
    multiplyScalar,
    clamp,
    divideByScalar,
    distanceSq,
    magnitude,
    IPoint
} from "../../utils/geom";
import {IBoid} from "../makeBoids";
export function separation(boid: IBoid, neighbors: IPoint[]) {
    const steer = {x: 0, y: 0};
    const numNeighbors = neighbors.length;
    if (!numNeighbors) return {x: 0, y: 0};
    for (let neighbor of neighbors) {
        const d = distanceSq(boid.position, neighbor) || Math.random();
        const diff = subtractVector({...boid.position}, neighbor);
        normalize(diff);
        divideByScalar(diff, d);
        addVector(steer, diff);
    }
    divideByScalar(steer, numNeighbors);
    const steerForce = magnitude(steer);
    if (steerForce > 0) {
        normalize(steer);
        multiplyScalar(steer, boid.speed);
        subtractVector(steer, boid.velocity);
        clamp(steer, boid.thrust);
    }
    return steer;
}
