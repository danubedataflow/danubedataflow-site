'use strict';

let palette;

function setupForm() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSelectBlendMode([BLEND, DIFFERENCE, HARD_LIGHT, OVERLAY]),
            makeSlider('numColors', 'XXX', 1, 32, 16),
            makeSlider('alphaRange', 'XXX', 0, 100, [20, 80]),
        ),
        makeSlider('numSquares', 'XXX', 20, 1000, 100, 20),
        makeSlider('squareLengthRange', 'XXX', 1, 100, [5, 30]),
    );
}

function drawSketch() {
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    blendMode(BLEND); // so background() actually clears the canvas
    background(int(random(palette)));
    blendMode(ctrl.blendMode);
    rectMode(CENTER);
    noStroke();

    for (let i = 0; i < ctrl.numSquares; i++) {
        let c = color(random(palette));

        // map [0,100]% to [0,255]
        c.setAlpha(randomIntRange(...ctrl.alphaRange.map(n => n * 255 / 100)));
        fill(c);

        let [minLength, maxLength] = ctrl.squareLengthRange;
        let s = int(random(width * minLength / 100, height * maxLength / 100));
        rect(int(random(width)), int(random(height)), s, s);
    }
}
