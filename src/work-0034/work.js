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

run({
    createdDate: '2026.01.14',
    setupControls,
    drawWork
});
