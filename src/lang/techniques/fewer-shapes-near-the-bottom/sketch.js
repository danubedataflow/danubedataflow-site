'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', '[% t.numTiles %]', 4, 40, 20),
        makeSlider('exponent', '[% t.sl('Exponent', 'Exponent', '指数') %]', 0, 5, 2, 0.1),
    );
}

function draw() {
    readControls();

    background('white');
    noStroke();
    fill('black');
    rectMode(CORNER);

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            /* 0 < yPercent < 1, so the higher the exponent the more
             * likely a rectangle will be drawn.
             */
            let yPercent = map(y, 1, ctrl.numTiles, 0, 1);
            scale(0.9); // to have space between the squares
            if (random() > pow(yPercent, ctrl.exponent)) rect(0, 0, dim, dim);

            pop();
        }
    }
}
