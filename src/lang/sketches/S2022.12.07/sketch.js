'use strict';

let palette, c1, c2;

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
        makeSlider('chanceDiagonal', 'Chance for orientation of the diagonal (%)', 0, 100, 50),
        makeSelect('colorStrategy', 'Color selection strategy', [
            makeOption('random', 'Random'),
            makeOption('adjacent', 'Adjacent'),
        ]),
    );
    noLoop();
}

function draw() {
    readControls();

    noStroke();
    rectMode(CORNER);
    palette = ['white', '#777777', 'black'];

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            let ul = [0, 0];
            let ur = [dim, 0];
            let ll = [0, dim];
            let lr = [dim, dim];

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

            pop();
        }
    }
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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
