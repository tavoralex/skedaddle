import {addVector, multiplyScalar, clamp, IPoint, divideByScalar} from "../utils/geom";
import {applyForce} from "./steering/applyForce";
import {IBoid} from "./makeBoids";

export function getSteering(boid: IBoid, forces: IPoint[]) {
    const steering = {x: 0, y: 0};
    for (let force of forces) {
        applyForce(steering, force);
    }
    divideByScalar(steering, forces.length);
    return steering;
}
