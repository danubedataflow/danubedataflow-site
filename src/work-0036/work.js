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
    randomElement
} from '/js/array.js';
import {
    Point
} from '/js/point.js';
let c, palette;

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

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);

    palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);

    // draw outer border if enabled
    if (c.ctrl.hasBorder) {
        c.ctx.strokeStyle = 'black';
        c.ctx.strokeRect(0, 0, c.width, c.height);
    }

    drawSquare(new Point(0, 0), c.width, 0);
}

function drawSquare(upperLeft, squareSize, currentDepth) {
    let [minDepth, maxDepth] = c.ctrl.subdivisionDepth;

    // If we haven't reached the minimum currentDepth, we have to subdividide.
    // After that, up to the maximum currentDepth, it depends on chance.
    const shouldSubdivide =
        currentDepth < minDepth || (currentDepth < maxDepth && random() < c.ctrl.subdivisionChance / 100);

    if (shouldSubdivide) {
        const half = squareSize / 2;
        drawSquare(upperLeft, half, currentDepth + 1);
        drawSquare(upperLeft.moveX(half), half, currentDepth + 1);
        drawSquare(upperLeft.moveY(half), half, currentDepth + 1);
        drawSquare(upperLeft.move(half, half), half, currentDepth + 1);
    } else {
        // it's a terminal square
        if (random() < c.ctrl.chanceFill / 100) {
            c.ctx.fillStyle = randomElement(palette);
            c.ctx.fillRect(...upperLeft.asArray(), squareSize, squareSize);
        }
        if (c.ctrl.hasBorder) {
            c.ctx.strokeStyle = 'black';
            c.ctx.strokeRect(...upperLeft.asArray(), squareSize, squareSize);
        }
    }
}
let description = `The canvas is subdivided into four squares. Each of these squares is recursively subdivided up to a random currentDepth. Each square has an optional border. Each terminal square has an optional fill.`;
run({
    createdDate: '2026-01-19',
    description,
    setupControls,
    drawWork
});
