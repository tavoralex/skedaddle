import {GridBoids} from "boids/GridBoids";
import {GridMap} from "types";
import {IScent} from "scentmap/scent/types";
import {boidTemplate} from "./boidTemplate";

export const populateBoids = (boids: GridBoids) => {
    Array.from({length: 11}, (n, i) => {
        boids.addBoidAtNode(589 + i * 2);
        boids.addBoidAtNode(640 + i * 2);
        boids.addBoidAtNode(691 + i * 2);
    });
};

export const makeBoids = (map: GridMap, scent: IScent) => {
    const boids = new GridBoids(boidTemplate, map.grid, map.display, map.walls, scent);
    populateBoids(boids);
    return boids;
};
