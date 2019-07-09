import {randomColor} from "../../utils/colorConversions";
import {Texture, ParticleContainer, Sprite} from "pixi.js";

export function makeBoidsViews(tex: Texture, quantity: number, tint: number = 0xaa0000, maxBoids: number = 200) {
    const view = new ParticleContainer(maxBoids, {
        uvs: true,
        tint: true,
        position: true,
        rotation: true,
        vertices: true
    });
    const sprites = Array.from({length: quantity}, () => {
        const sprite = new Sprite(tex);
        view.addChild(sprite);
        sprite.tint = parseInt(randomColor(), 16); // tint;
        // sprite.anchor.set(0.275, 0.5);
        return sprite;
    });

    return {view, sprites};
}
