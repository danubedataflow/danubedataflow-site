'use strict';

const config = new Config()
    .title('S2022-010')
    .maxIterations(1);

let palette;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numColors', 'Number of colors', 1, 32, 16),
    makeSlider('numSquares', 'Number of squares', 20, 1000, 100, 20),
    makeSlider('alpha', 'Transparency (%)', 0, 100, [20, 80]),
    makeSlider('size', 'Size (%)', 1, 100, [5, 30]),
);

function drawSketch() {
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    background(int(random(palette)));
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