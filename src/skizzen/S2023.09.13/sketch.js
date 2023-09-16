'use strict';

function setupForm() {
    makeForm(
        makeSlider('numRects', 'Anzahl der Rechtecke', 10, 100, 50),
        makeSlider('strokeWeight', 'Strichstärke', 1, 20, [2, 4]),
        makeSlider('alpha', 'Transparenz (Alpha)', 0, 255, [200, 255]),
    );
}

function drawSketch() {
    readControls();

    background('white');
    noFill();

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = int(random(width));
        let ulY = int(random(height));
        let w = int(random(width - ulX));
        let h = int(random(height - ulY));

        strokeWeight(randomIntRange(...ctrl.strokeWeight));
        stroke(0, randomIntRange(...ctrl.alpha));
        rect(ulX, ulY, w, h);
    }
}
