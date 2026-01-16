'use strict';

import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    random
} from '/js/math.js';
import {
    pairwise
} from '/js/array.js';

function setupControls() {
    makeForm(
        makeSlider('percentNumPoints', 'Number of points: {0}% of width', 5, 15, 10),
        makeSlider('percentMean', 'Gaussian mean: {0}% of width', 30, 70, 50),
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
    let numPoints = width * ctrl.percentNumPoints / 100;
    let mean = width * ctrl.percentMean / 100;
    let standardDeviation = width * ctrl.percentStandardDeviation / 100;

    for (let i = 1; i <= numPoints; i++) {
        let x = Math.floor(gaussianRandom(mean, standardDeviation));
        x = Math.min(Math.max(x, 0), width); // keep inside the canvas

        // subtract from height so it goes from bottom to top
        let y = height - ((Math.pow(i, 2) + 5 * i) % height);

        points.push([x, y]);
    }
    pairwise(points, (current, next) => {
        ctx.beginPath();
        ctx.moveTo(...current);
        ctx.lineTo(...next);
        ctx.stroke();
    });
}

// Source - https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, standardDeviation = 1) {
    const u = 1 - random(); // convert [0,1) to (0,1]
    const v = random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * standardDeviation + mean;
}

let description = `Lines join points whose horizontal positions are Gaussian, bounded by the canvas. The vertical positions increase quadratically. If a vertical position is outside the canvas, it is reflected to the bottom of the canvas (modulo). Homage to "Gaussian-Quadratic" by Michael Noll, 1963.`;

run({
    createdDate: '2026.01.14',
    description,
    setupControls,
    drawWork
});
