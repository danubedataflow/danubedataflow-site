'use strict';

function setupForm() {
    makeForm(
        makeSelectColorMap(),
        makeSelectBlendMode([BLEND, DARKEST, DIFFERENCE, EXCLUSION, HARD_LIGHT, MULTIPLY]),
        makeSlider('numColors', 'Anzahl der Farben', 1, 32, 25),
        makeSlider('maxLength', 'Maximale Länge', 3, 19, 11, 2),
    );
}

function drawSketch() {
    readControls();
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    blendMode(ctrl.blendMode);
    noStroke();
    translate(width / 2, height / 2);

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    let colorIndex = int(random(palette.length));

    let magnify = int(width / ctrl.maxLength);
    let numPoints = Math.pow(ctrl.maxLength, 2);

    rectMode(CENTER);
    iterateSquareSpiral(numPoints, (x, y, n) => {
        let direction = random([-1, 1]);

        // wrap around
        colorIndex = (palette.length + colorIndex + direction) % palette.length;

        fill(palette[colorIndex]);
        rect(x * magnify, y * magnify, magnify, magnify);
    });
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
        let term = PI / 2 * Math.floor(sqrt(4 * k - 3));
        x += sin(term);
        y += cos(term);
        callback(x, y, k);
    }
}
