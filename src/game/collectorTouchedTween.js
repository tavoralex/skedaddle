import * as Tween from "es6-tween";

export const collectorTouchedTween = ({sprite, duration = 300}) => {
    Tween.autoPlay(true);
    sprite.scale.set(1, 1);
    sprite.alpha = 1;
    const t = new Tween.Tween({scale: 1, alpha: 1})
        .to({scale: 6, alpha: 0}, duration)
        .start()
        .easing(Tween.Easing.Quadratic.Out)
        .on("update", v => {
            sprite.scale.set(v.scale, v.scale);
            sprite.alpha = v.alpha;
        });
    return t;
};
