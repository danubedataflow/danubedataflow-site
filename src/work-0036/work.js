import {
    run,
    makeForm,
    makeSlider,
    makeCheckbox,
    makeFieldset,
    makeSelectColorMap
} from '/js/ui.js';
import {
    random
} from '/js/math.js';
import {
    pairwise,
    randomElement
} from '/js/array.js';
const BORDER_COLOR = "#000";
let palette;

function setupControls() {
    makeForm(
        makeSlider('subdivisionDepth', 'Subdivision recursion depth: {0} to {1} levels', 2, 6, [2, 5]),
        makeSlider('subdivisionChance', '{0}% probability that subdividing continues at each level', 20, 80, 60),
        makeSlider('chanceFill', '{0}% probability that a terminal square is filled', 20, 80, 50),
        makeCheckbox('hasBorder', 'Square border: '),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 10, 6),
        ),
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
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    // draw outer border if enabled
    if (ctrl.hasBorder) {
        ctx.strokeStyle = BORDER_COLOR;
        ctx.strokeRect(0, 0, width, height);
    }
    // start recursion
    drawSquare(0, 0, width, 0, ctx, ctrl);
}
/**
 * Recursively subdivides and draws squares
 * @param {number} x - top-left x
 * @param {number} y - top-left y
 * @param {number} size - width/height of the square
 * @param {number} depth - current recursion depth
 */
function drawSquare(x, y, size, depth, ctx, ctrl) {
    let [minDepth, maxDepth] = ctrl.subdivisionDepth;
    const shouldSubdivide =
        depth < minDepth || (depth < maxDepth && random() < ctrl.subdivisionChance / 100);
    if (shouldSubdivide) {
        const half = size / 2;
        drawSquare(x, y, half, depth + 1, ctx, ctrl);
        drawSquare(x + half, y, half, depth + 1, ctx, ctrl);
        drawSquare(x, y + half, half, depth + 1, ctx, ctrl);
        drawSquare(x + half, y + half, half, depth + 1, ctx, ctrl);
    } else {
        // terminal square
        if (random() < ctrl.chanceFill / 100) {
            ctx.fillStyle = randomElement(palette);
            ctx.fillRect(x, y, size, size);
        }
        if (ctrl.hasBorder) {
            ctx.strokeStyle = BORDER_COLOR;
            ctx.strokeRect(x, y, size, size);
        }
    }
}
let description = `The canvas is subdivided into four squares. Each of these squares is recursively subdivided up to a random depth. Each square has an optional border. Each terminal square has an optional fill.`;
run({
    createdDate: '2026-01-19',
    description,
    setupControls,
    drawWork
});