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

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = ctrl.blendMode;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    let colorIndex = randomIntUpTo(palette.length);
    let magnify = Math.round(width / ctrl.maxLength);
    let numPoints = Math.pow(ctrl.maxLength, 2);
    iterateSquareSpiral(numPoints, (x, y, n) => {
        let direction = randomIntUpTo(2) - 1; // [-1, +1]
        // wrap around
        colorIndex = (palette.length + colorIndex + direction) % palette.length;
        let c = palette[colorIndex];
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.fillRect(x * magnify, y * magnify, magnify, magnify);
    });
    ctx.restore();
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