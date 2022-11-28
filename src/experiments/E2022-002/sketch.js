'use strict';

const config = new Config()
    .title('E2022-002')
    .maxIterations(1);

function makeSelectColor() {
    let containerDiv = makeSelect(
        'color',
        'Color',
        makeOption('black', 'Black'),
        makeOption('red', 'Red'),
        makeOption('green', 'Green'),
        makeOption('blue', 'Blue'),
    );
    controls.color.setValue('black');
    return containerDiv;
}

makeForm(
    makeSlider('horizontalBars', 'Number of horizontal bars', 1, 10, 5),
    makeSlider('verticalBars', 'Number of vertical bars', 1, 10, 5),
    makeSlider('size', 'Size of bars in percent of canvas dimension', 1, 20, [9, 13]),
    makeFieldset('Color',
        makeSelectColor(),
        makeSlider('alpha', 'Alpha', 1, 255, [50, 200]),
    ),
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
        let w = int(random(...ctrl.size.map(x => x * width / 100)));
        let c = color(ctrl.color);
        c.setAlpha(int(random(...ctrl.alpha)));
        fill(c);
        rect(x1, 0, w, height);
    }
    for (let i = 0; i <= ctrl.verticalBars; i++) {
        let y1 = int(random(width));
        let h = int(random(...ctrl.size.map(x => x * height / 100)));
        let c = color(ctrl.color);
        c.setAlpha(int(random(...ctrl.alpha)));
        fill(c);
        rect(0, y1, width, h);
    }
}
