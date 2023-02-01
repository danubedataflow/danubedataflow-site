'use strict';

let palette;

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSelectColorMap(),
        makeSelectBlendMode([BLEND, DIFFERENCE, HARD_LIGHT, OVERLAY]),
        makeSlider('numColors', '[% t.numColors %]', 1, 32, 16),
        makeSlider('numSquares', 'Number of squares', 20, 1000, 100, 20),
        makeSlider('alpha', 'Transparency (%)', 0, 100, [20, 80]),
        makeSlider('size', 'Size (%)', 1, 100, [5, 30]),
    );
    noLoop();
}

function draw() {
    readControls();
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    blendMode(BLEND); // so background() actually clears the canvas
    background(int(random(palette)));
    blendMode(ctrl.blendMode);
    rectMode(CENTER);
    noStroke();

    for (let i = 0; i < ctrl.numSquares; i++) {
        let c = color(random(palette));

        // map [0,100]% to [0,255]
        c.setAlpha(randomIntRange(...ctrl.alpha.map(n => n * 255 / 100)));
        fill(c);

        let [minSize, maxSize] = ctrl.size;
        let s = int(random(width * minSize / 100, height * maxSize / 100));
        rect(int(random(width)), int(random(height)), s, s);
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
