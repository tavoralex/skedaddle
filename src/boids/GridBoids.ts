import {PeerBoid} from "./../components/types";
import {IPoint, multiplyScalar, addVector, clamp, normalize} from "../utils/geom";
import {IGridBoid} from "./IGridBoid";
import {IBoidTemplate} from "./IBoidTemplate";
import Grid from "../scentmap/hexgrid/Grid";
import {IDisplay} from "../pixi/types";
import {IScent} from "../scentmap/scent/types";
import {makeBoids} from "./makeBoids";
import {makeBoidsViews} from "../pixi/boids/makeBoidsViews";
import {makeBoid} from "./makeBoid";
import {separation} from "./behavior/separation";
import {cohesion} from "./behavior/cohesion";
import {getSteering} from "./getSteering";

const MAX_NEIGHBORS = 12;
const INITIAL_BOIDS = 0;
const MAX_BOIDS = 200;

export class GridBoids {
    public boids!: IGridBoid[];
    public boidViews!: PIXI.Sprite[];
    private occupiableNodes!: Array<Set<IGridBoid>>;
    private numNodes!: number;

    constructor(
        public boidTemplate: IBoidTemplate,
        public grid: Grid,
        public display: IDisplay,
        public walls: number[],
        public scentToAvoid: IScent
    ) {
        this.initialize();
    }

    public reset() {
        if (this.boidViews && this.boidViews.length) {
            const view = this.boidViews[0].parent;
            if (view.parent) {
                view.parent.removeChild(view);
            }
        }
        this.initialize();
    }

    public update(delta?: number) {
        this.updateBoids(delta);
        this.updateViews(delta);
    }

    public addBoid(position: IPoint) {
        const b = makeBoid(this.boidTemplate) as IGridBoid;
        this.boids.push(b);
        b.position = {...position};
        b.node = this.grid.getHexIdByPixel(b.position);
        return b;
    }

    public addBoidAtNode(nodeId: number) {
        const b = makeBoid(this.boidTemplate) as IGridBoid;
        this.boids.push(b);
        b.node = nodeId;
        b.position = this.grid.getPosAtNode(nodeId);
        return b;
    }

    public removeBoid(boid?: IGridBoid) {
        if (boid) {
            this.boids.splice(this.boids.indexOf(boid), 1);
            return;
        }
        this.boids.pop();
    }

    public syncBoid(syncWith: PeerBoid, index: number) {
        const boid = this.boids[index];
        boid.position.x = syncWith.position.x;
        boid.position.y = syncWith.position.y;
        boid.velocity.x = syncWith.velocity.x;
        boid.velocity.y = syncWith.velocity.y;

        boid.node = this.grid.getHexIdByPixel(boid.position);
    }

    private updateViews(delta?: number) {
        const l = this.boids.length;
        this.boidViews.forEach((sprite, i) => {
            sprite.alpha = i < l ? 1 : 0;
            if (sprite.alpha) {
                const boid = this.boids[i];
                sprite.tint = this.boidTemplate.hue;
                sprite.position.set(boid.position.x, boid.position.y);
                sprite.scale.x !== boid.radius && sprite.scale.set(boid.radius, boid.radius);
            }
        });
    }

    private updateBoids(delta?: number) {
        this.boids.forEach(boid => {
            if (boid.node < 0 || boid.node >= this.numNodes) return;
            const node = this.grid.getHexIdByPixel(boid.position);
            if (isNaN(node)) return;
            const oNodes = this.occupiableNodes;
            boid.node && oNodes[boid.node].delete(boid);
            boid.node = node;
            const neighborNodes = this.grid.gridArr[boid.node].neighbors.filter(n => !isNaN(n));
            let neighbors: IGridBoid[] = [];
            const obstacles = new Array<IPoint>();
            neighborNodes.forEach(n => {
                const ns = Array.from(oNodes[n]);
                ns.length && neighbors.length < MAX_NEIGHBORS && (neighbors = neighbors.concat(ns));
                !this.walls[n] && obstacles.push(this.grid.gridArr[n].position);
            });

            let highestScent: number = 0;
            let avoidGoal: IPoint | null = null;

            for (let neighbor of neighborNodes) {
                const avoidVal = this.scentToAvoid.scentGrid[neighbor];
                if (avoidVal > highestScent && avoidVal > boid.olfaction) {
                    highestScent = avoidVal;
                    avoidGoal = {...this.grid.gridArr[neighbor].position};
                }
            }
            const avoidGoals = avoidGoal ? [avoidGoal] : [];
            const forces = [
                multiplyScalar(separation(boid, obstacles), this.boidTemplate.weights.avoidObstacles * 100),
                multiplyScalar(separation(boid, neighbors.map(n => n.position)), this.boidTemplate.weights.separation),
                multiplyScalar(separation(boid, avoidGoals), this.boidTemplate.weights.avoidScent),
                multiplyScalar(cohesion(boid, neighbors.map(n => n.position)), this.boidTemplate.weights.cohesion)
                // multiplyScalar(wander(boid, current), 1),
                // multiplyScalar(alignment(boid, neighbors.map(n => n.velocity)), this.boidTemplate.weights.alignment)
            ];
            const steer = getSteering(boid, forces);
            applySteering(steer, boid, delta || 1);
            oNodes[boid.node].add(boid);
        });
    }

    private initialize() {
        this.boids = (makeBoids(INITIAL_BOIDS, this.boidTemplate) as any) as IGridBoid[];
        const boidViewsObj = makeBoidsViews(this.display.hexTexture, MAX_BOIDS);
        this.display.camera.addChild(boidViewsObj.view);
        this.boidViews = boidViewsObj.sprites;
        this.occupiableNodes = Array.from(this.grid.gridArr, node => new Set<IGridBoid>());
        this.numNodes = this.grid.gridArr.length;
    }
}

const applySteering = (steering: IPoint, boid: IGridBoid, delta: number) => {
    normalize(steering);
    multiplyScalar(steering, boid.thrust);
    addVector(boid.velocity, steering);
    clamp(boid.velocity, boid.speed);
    const motion = multiplyScalar({...boid.velocity}, delta);
    addVector(boid.position, motion);
    multiplyScalar(boid.velocity, boid.drag);
};
