export const updateWallsView = (walls: number[], sprites: PIXI.Sprite[]) => {
    for (let i = 0; i < walls.length; i++) {
        sprites[i].alpha = Math.abs(walls[i] - 1);
    }
};
