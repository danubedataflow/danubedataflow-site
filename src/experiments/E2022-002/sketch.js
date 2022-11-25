'use strict';

const config = new Config()
    .title('E2022-002')
    .maxIterations(1);

makeForm(
    makeSlider('horizontalBars', 'Number of horizontal bars', 1, 10, 5),
    makeSlider('verticalBars', 'Number of vertical bars', 1, 10, 5),
    makeSlider('alpha', 'Alpha', 1, 255, [50, 200]),
);

function initSketch() {
    background('white');
    noStroke();
    fill('black');
    rectMode(CORNER);
}

function drawSketch() {
    for (let i = 0; i <= ctrl.horizontalBars; i++) {
        let x1 = int(random(width));
        let w = int(random(width / 10, width / 8));
        let c = color('black');
        c.setAlpha(int(random(...ctrl.alpha)));
        fill(c);
        rect(x1, 0, w, height);
    }
    for (let i = 0; i <= ctrl.verticalBars; i++) {
        let y1 = int(random(width));
        let h = int(random(width / 10, width / 8));
        let c = color('black');
        c.setAlpha(int(random(...ctrl.alpha)));
        fill(c);
        rect(0, y1, width, h);
    }
}
