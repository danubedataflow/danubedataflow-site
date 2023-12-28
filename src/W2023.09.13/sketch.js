'use strict';

function setupForm() {
    makeForm(
        makeSlider('numRects', 'Anzahl der Rechtecke', 10, 100, 50),
        makeSlider('strokeWeightRange', 'XXX', 1, 20, [2, 4]),
        makeSlider('alpha', 'Transparenz (Alpha)', 0, 255, [200, 255]),
    );
}

function drawSketch() {
    background('white');
    noFill();
    rectMode(CORNER);

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = int(random(width));
        let ulY = int(random(height));
        let w = int(random(width - ulX));
        let h = int(random(height - ulY));

        strokeWeight(randomIntRange(...ctrl.strokeWeightRange));
        stroke(0, randomIntRange(...ctrl.alpha));
        rect(ulX, ulY, w, h);
    }
}
