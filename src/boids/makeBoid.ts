export function makeBoid(template?: any) {
    return {
        ...{
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 0},
            drag: 0.1,
            speed: 1,
            thrust: 10,
            radius: 1
        },
        ...template
    };
}
