const config = {min: 0, refillPerSecond: 20};

export function makeFillbars(bars: {max: number; top: number; bottom: number}) {
    const updateBar = (bar: number, delta: number) => {
        const result = bar + config.refillPerSecond * delta;
        if (result >= bars.max) {
            return bars.max;
        }
        return result;
    };
    const update = (delta: number) => {
        bars.top = updateBar(bars.top, delta);
        bars.bottom = updateBar(bars.bottom, delta);
    };
    return {bars, update};
}
