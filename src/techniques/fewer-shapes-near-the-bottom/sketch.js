'use strict';

const config = new Config()
    .title('Fewer shapes near the bottom')
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('power', 'Power', 0, 5, 2, 0.1),
);

function initSketch() {
    background('white');
    noStroke();
    fill('black');
    rectMode(CENTER);
}

function drawSketch() {

    let marginY = int(height / (2 * ctrl.numTiles));
    let marginX = int(width / (2 * ctrl.numTiles));
    let dim = width * 0.9 / ctrl.numTiles; // and width == height

    for (let y = 1; y <= ctrl.numTiles; y++) {
        let centerY = map(y, 1, ctrl.numTiles, marginY, height - marginY);
        let yPercent = map(y, 1, ctrl.numTiles, 0, 1);
        for (let x = 1; x <= ctrl.numTiles; x++) {
            let centerX = map(x, 1, ctrl.numTiles, marginX, width - marginX);

            /* yPercent is < 1, so the higher the power the more likely a
             * rectangle will be drawn.
             */
            if (random() > pow(yPercent, ctrl.power)) rect(centerX, centerY, dim, dim);
        }
    }
}
