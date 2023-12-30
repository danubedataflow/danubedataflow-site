'use strict';

function setupForm() {
    makeForm(
        makeSlider('numHorizontalLines', 1, 10, 5),
        makeSlider('numVerticalLines', 1, 10, 5),
        makeSlider('strokeWeightRangeRelative', 1, 20, [9, 13]),
        makeFieldset('colors',
            makeSlider('colorAngle', 0, 359, 0),
            makeSlider('saturationRange', 40, 100, [60, 80]),
            makeSlider('brightnessRange', 40, 100, [60, 80]),
            makeSlider('alphaRange', 1, 255, [50, 200]),
        ),
    );
}

function setRandomFillColor() {
    fill(
        ctrl.colorAngle,
        randomIntRange(...ctrl.saturationRange),
        randomIntRange(...ctrl.brightnessRange),
        randomIntRange(...ctrl.alphaRange)
    );
}

function drawSketch() {
    background('white');
    noStroke();
    fill('black');
    colorMode(HSB, 360, 100, 100, 100);

    for (let i = 0; i <= ctrl.numHorizontalLines; i++) {
        let x1 = int(random(width));
        let w = int(random(...ctrl.strokeWeightRangeRelative.map(x => x * width / 100)));
        setRandomFillColor();
        rect(x1, 0, x1 + w, height);
    }
    for (let i = 0; i <= ctrl.numVerticalLines; i++) {
        let y1 = int(random(width));
        let h = int(random(...ctrl.strokeWeightRangeRelative.map(x => x * height / 100)));
        setRandomFillColor();
        rect(0, y1, width, y1 + h);
    }
}
