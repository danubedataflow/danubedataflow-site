import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode
} from '/js/ui.js';
import {
    random,
    randomIntUpTo
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'darken', 'difference', 'exclusion', 'hard-light', 'multiply']),
            makeSlider('numColors', 'Number of colors: {0}', 1, 32, 25),
        ),
        makeSlider('maxLength', 'Maximum length: {0}', 3, 19, 11, 2),
    );
}

function drawWork(config) {
    c = config;
    // actually clear the canvas
    c.ctx.globalCompositeOperation = 'source-over';
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.globalCompositeOperation = c.ctrl.blendMode;
    c.ctx.save();
    c.ctx.translate(c.width / 2, c.height / 2);
    let palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);
    let colorIndex = randomIntUpTo(palette.length);
    let magnify = Math.round(c.width / c.ctrl.maxLength);
    let numPoints = Math.pow(c.ctrl.maxLength, 2);
    iterateSquareSpiral(numPoints, (x, y, n) => {
        let direction = randomIntUpTo(2) - 1; // [-1, +1]
        // wrap around
        colorIndex = (palette.length + colorIndex + direction) % palette.length;
        c.ctx.fillStyle = palette[colorIndex];
        c.ctx.beginPath();
        c.ctx.fillRect(x * magnify, y * magnify, magnify, magnify);
    });
    c.ctx.restore();
}
/* See https://math.stackexchange.com/a/4128516
 *
 * x(n) is the sum of sin(term) for 1 <= k <= n.
 *
 * y(n) is the sum of cos(term) for 1 <= k <= n.
 *
 * Since we are iterating, we just need to add the latest term to get the new
 * values.
 */
function iterateSquareSpiral(max, callback) {
    let x = 0,
        y = 0;
    callback(x, y, 0);
    for (let k = 1; k < max; k++) {
        let term = Math.PI / 2 * Math.floor(Math.sqrt(4 * k - 3));
        x += Math.sin(term);
        y += Math.cos(term);
        callback(x, y, k);
    }
}
let description = `Randomly colored tiles on a squared spiral.`;
run({
    createdDate: '2022-09-08',
    description,
    setupControls,
    drawWork
});