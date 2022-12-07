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
    noStroke();
    rectMode(CENTER);
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
            let ul = [-dim / 2, -dim / 2];
            let ur = [dim / 2, -dim / 2];
            let ll = [-dim / 2, dim / 2];
            let lr = [dim / 2, dim / 2];

            // choose two different random colors
            let c1 = random(p);
            let c2;
            do {
                c2 = random(p);
            } while (c1 == c2);

            if (random(100) < ctrl.chanceDiagonal) {
                // upper left to lower right
                fill(c1);
                triangle(...ul, ...lr, ...ll);
                fill(c2);
                triangle(...ul, ...lr, ...ur);

            } else {
                // upper right to lower left
                fill(c1);
                triangle(...ur, ...ll, ...lr);
                fill(c2);
                triangle(...ur, ...ll, ...ul);
            }
        }
    });
}
