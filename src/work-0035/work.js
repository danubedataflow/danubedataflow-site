import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
import {
    pairwise
} from '/js/array.js';

function setupControls() {
    makeForm(
        makeSlider('numPoints', 'Number of points: {0}', 50, 700, 350),
        makeSlider('percentMaxLineLength', 'Maximum line length: {0}% of width', 10, 20, 15),
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
    for (let i = 1; i <= ctrl.numPoints; i++) {
        points.push({
            x: randomIntUpTo(width),
            y: randomIntUpTo(height)
        });
    }
    // Make maxLineLength dependent on width, but use the same number of points
    // regardless of the width. That way the work looks the same at different
    // canvas sizes.
    let maxLineLength = width * ctrl.percentMaxLineLength / 100;
    let pairs = findClosePairs(points, maxLineLength);
    for (const [p1, p2] of pairs) {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
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