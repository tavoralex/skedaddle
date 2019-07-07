import {addVector, IPoint} from "../../utils/geom";
export function applyForce(vector: IPoint, force: IPoint) {
    addVector(vector, force);
}
