export interface IBoidTemplate {
    drag: number;
    speed: number;
    thrust: number;
    radius: number;
    hue: number;
    olfaction: number;
    weights: {
        separation: number;
        cohesion: number;
        seekScent: number;
        avoidScent: number;
        avoidObstacles: number;
        alignment: number;
    };
}
