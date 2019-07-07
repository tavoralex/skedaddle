export interface IPoint {
    x: number;
    y: number;
}

export const rotateToPoint = (m: IPoint, p: IPoint) => Math.atan2(m.y - p.y, m.x - p.x);

export const randomlyPositionInCircle = (maxDistanceSq: number, minDistanceSq: number, p: IPoint) => {
    const ptAngle = Math.random() * 2 * Math.PI;
    const ptRadiusSq = minDistanceSq + Math.random() * maxDistanceSq;
    p.x += Math.sqrt(ptRadiusSq) * Math.cos(ptAngle);
    p.y += Math.sqrt(ptRadiusSq) * Math.sin(ptAngle);
};

export const clamp = (a: IPoint, limit: number) => {
    if (magnitude(a) > limit) {
        const n = normalize(a);
        return multiplyScalar(n, limit);
    }
    return a;
};

export const distanceSq = (b: IPoint, a: IPoint) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dx * dx + dy * dy;
};

export const areEqual = (a: IPoint, b: IPoint) => {
    return Math.round(a.x) === Math.round(b.x) && Math.round(a.y) === Math.round(b.y);
};

export const magnitude = (a: IPoint) => {
    return Math.sqrt(a.x * a.x + a.y * a.y);
};

export const normalize = (a: IPoint) => {
    const m = magnitude(a);
    if (m > 0) {
        return multiplyScalar(a, 1 / m);
    }
    return a;
};

export const multiplyScalar = (v: IPoint, scalar: number) => {
    v.x *= scalar;
    v.y *= scalar;
    return v;
};

export const divideByScalar = (v: IPoint, scalar: number) => {
    v.x /= scalar;
    v.y /= scalar;
    return v;
};

export const sqrt = (v: IPoint) => {
    v.x = Math.sqrt(v.x);
    v.y = Math.sqrt(v.y);
    return v;
};

export const addVector = (a: IPoint, b: IPoint) => {
    a.x += b.x;
    a.y += b.y;
    return a;
};

export const subtractVector = (a: IPoint, b: IPoint) => {
    a.x -= b.x;
    a.y -= b.y;
    return a;
};

export const rotateVector = (vec: IPoint, ang: number) => {
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    vec.x = vec.x * cos - vec.y * sin;
    vec.y = vec.x * sin + vec.y * cos;
    return vec;
};
