import {addVector, divideByScalar, IPoint} from "../../utils/geom";
import {seek} from "../steering/seek";
import {IBoid} from "../makeBoids";

export function cohesion(boid: IBoid, neighbors: IPoint[]) {
    const steer = {x: 0, y: 0};
    const numNeighbors = neighbors.length;
    if (!numNeighbors) return {x: 0, y: 0};
    for (let neighbor of neighbors) {
        addVector(steer, neighbor);
    }
    return seek(divideByScalar(steer, numNeighbors), boid);
}
