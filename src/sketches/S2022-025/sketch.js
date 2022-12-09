'use strict';

const config = new Config()
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('chanceDiagonal', 'Chance for orientation of the diagonal (%)', 0, 100, 50),
    makeSelect('colorStrategy', 'Color selection strategy',
        makeOption('random', 'Random'),
        makeOption('adjacent', 'Adjacent'),
    ),
);

let palette, c1, c2;

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
            let ul = [-dim / 2, -dim / 2];
            let ur = [dim / 2, -dim / 2];
            let ll = [-dim / 2, dim / 2];
            let lr = [dim / 2, dim / 2];

            chooseColors();
            if (random(100) < ctrl.chanceDiagonal) {
                // upper left to lower right
                fill(c1);
                triangle(...ul, ...lr, ...ll);
                fill(c2);
                triangle(...ul, ...lr, ...ur);

            } else {
                // upper right to lower left
                fill(c1);
                triangle(...ur, ...ll, ...ul);
                fill(c2);
                triangle(...ur, ...ll, ...lr);
            }

            c1 = c2;
        }
    });
}

function chooseColors() {
    if (ctrl.colorStrategy === 'random') {
        // choose two different random colors

        c1 = random(palette);
        do {
            c2 = random(palette);
        } while (c1 == c2);

    } else if (ctrl.colorStrategy === 'adjacent') {
        c1 = c2; // reuse previous color
        if (c1 === undefined) c1 = random(palette);
        do {
            c2 = random(palette);
        } while (c1 == c2);
    } else {
        console.log('invalid color strategy ' + ctrl.colorStrategy);
    }
}
