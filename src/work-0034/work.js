import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    gaussianRandom
} from '/js/math.js';
import {
    pairwise
} from '/js/array.js';

function setupControls() {
    makeForm(
        makeSlider('numPoints', 'Number of points: {0}', 25, 75, 50),
        makeSlider('percentStandardDeviation', 'Standard deviation: {0}% of width', 5, 25, 15),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    let points = [];
    let standardDeviation = width * ctrl.percentStandardDeviation / 100;
    for (let i = 1; i <= ctrl.numPoints; i++) {
        let x = Math.floor(gaussianRandom(width / 2, standardDeviation));
        // Calculate y for an imaginary height of 500, then scale to the actual
        // height. This is so the result looks the same regardless of the
        // canvas size. Also subtract from height so it goes from bottom to top.
        let y = 500 - ((Math.pow(i, 2) + 5 * i) % 500);
        y *= height / 500;
        points.push([x, y]);
    }
    pairwise(points, (current, next) => {
        ctx.beginPath();
        ctx.moveTo(...current);
        ctx.lineTo(...next);
        ctx.stroke();
    });
}
let description = `Lines join points whose horizontal positions are Gaussian, bounded by the canvas. The vertical positions increase quadratically. If a vertical position is outside the canvas, it is reflected to the bottom of the canvas (modulo). Homage to "Gaussian-Quadratic" by Michael Noll, 1963.`;
run({
    createdDate: '2026-01-14',
    description,
    setupControls,
    drawWork
});
