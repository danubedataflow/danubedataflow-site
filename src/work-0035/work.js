import {
    run,
    makeForm,
    makeSlider,
    makeSelect,
    makeOption,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo,
    gaussianRandom
} from '/js/math.js';
import {
    pairwise
} from '/js/array.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numPoints', 'Number of points: {0}', 50, 700, 350),
        makeSlider('percentMaxLineLength', 'Maximum line length: {0}% of c.width', 10, 20, 15),
        makeSelect('randomType', 'Random type: ', [
            makeOption('standard', 'Standard'),
            makeOption('gaussian', 'Gaussian'),
        ]),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas();
    c.ctx.strokeStyle = 'black';
    let points = [];
    for (let i = 1; i <= c.ctrl.numPoints; i++) {
        points.push({
            x: randomCoordinate(c.ctrl.randomType, c.width),
            y: randomCoordinate(c.ctrl.randomType, c.height)
        });
    }
    // Make maxLineLength dependent on c.width, but use the same number of points
    // regardless of the c.width. That way the work looks the same at different
    // canvas sizes.
    let maxLineLength = c.width * c.ctrl.percentMaxLineLength / 100;
    let pairs = findClosePairs(points, maxLineLength);
    for (const [p1, p2] of pairs) {
        c.ctx.strokeStyle = 'black';
        c.ctx.beginPath();
        c.ctx.moveTo(p1.x, p1.y);
        c.ctx.lineTo(p2.x, p2.y);
        c.ctx.closePath();
        c.ctx.stroke();
    }
}

function randomCoordinate(type, limit) {
    if (type == 'standard') {
        return randomIntUpTo(limit);
    } else if (type == 'gaussian') {
        return gaussianRandom(limit / 2, limit / 2) // [0, limit]
    } else {
        console.log(`unknown random type '${type}'`);
    }
}
/* Given an array of points, each represented by an object with an x key and a
 * y key, find all pairs of points whose distance in pixels is less than a
 * given value.
 *
/* Brute-force version. O(n^2)
 *
 * Compare every pair of points once and compute the Euclidean distance.
 */
function findClosePairs(points, maxDist) {
    const result = [];
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            if (dx * dx + dy * dy < maxDistSq) {
                result.push([points[i], points[j]]);
            }
        }
    }
    return result;
}
let description = `Place random points. Draw a line between each pair of points whose Euclidean distance is less than a given value.`;
run({
    createdDate: '2026-01-18',
    description,
    setupControls,
    drawWork
});
