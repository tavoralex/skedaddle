/**
 * Starts an animation loop
 * @param callback - function to call with every tick
 * @returns cancel - cancellation function
 */
export function animationLoop(callback: () => void) {
    let id = 0;
    (function l() {
        id = window.requestAnimationFrame(l);
        callback();
    })();
    return () => {
        window.cancelAnimationFrame(id);
    };
}
