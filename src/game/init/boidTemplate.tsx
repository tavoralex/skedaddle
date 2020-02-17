export const boidTemplate = {
    drag: 0.999,
    speed: 150,
    thrust: 10,
    radius: 1,
    olfaction: 0.001,
    hue: 0xff80ff,
    weights: {
        separation: 11,
        cohesion: 4,
        seekScent: 6,
        avoidScent: 8,
        avoidObstacles: 12,
        alignment: 1
    }
};
