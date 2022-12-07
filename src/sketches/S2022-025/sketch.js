'use strict';

const config = new Config()
    .title('S2022-025')
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('chanceDiagonal', 'Chance for orientation of the diagonal (%)', 0, 100, 50),
);

let palette;

function initSketch() {
    background('white');
    noStroke();
    rectMode(CENTER);
    angleMode(DEGREES);
    palette = ['white', '#777777', 'black'];
}

function drawSketch() {
    simpleGrid({
        numTiles: ctrl.numTiles,
        margin: width / 10,
        callback: (config) => {
            let {
                dim
            } = config;
            let p = [...palette]; // clone

            // choose two different random colors
            let c1 = random(p);
            let c2;
            do {
                c2 = random(p);
            } while (c1 == c2);

            if (random(100) < ctrl.chanceDiagonal) {
                // upper left to lower right
                fill(c1);
                triangle(-dim / 2, -dim / 2, dim / 2, dim / 2, -dim / 2, dim / 2);
                fill(c2);
                triangle(-dim / 2, -dim / 2, dim / 2, dim / 2, dim / 2, -dim / 2);

            } else {
                // upper right to lower left
                fill(c1);
                triangle(dim / 2, -dim / 2, -dim / 2, dim / 2, dim / 2, dim / 2);
                fill(c2);
                triangle(dim / 2, -dim / 2, -dim / 2, dim / 2, -dim / 2, -dim / 2);
            }
        }
    });
}
