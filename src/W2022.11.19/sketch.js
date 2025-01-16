'use strict';

function setupControls() {
    makeForm(
        makeSlider('numHorizontalLines', 1, 10, 5),
        makeSlider('numVerticalLines', 1, 10, 5),
        makeSlider('lineWidthRangeRelative', 1, 20, [9, 13]),
        makeFieldset('colors',
            makeSlider('colorAngle', 0, 359, 0),
            makeSlider('saturationRange', 40, 100, [60, 80]),
            makeSlider('brightnessRange', 40, 100, [60, 80]),
            makeSlider('alphaRange', 1, 100, [20, 80]),
        ),
    );
}

function setRandomFillColor() {
    ctx.fillStyle = colorHSLA(
        ctrl.colorAngle,
        randomIntRange(...ctrl.saturationRange),
        randomIntRange(...ctrl.brightnessRange),
        randomIntRange(...ctrl.alphaRange) / 100
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black';

    for (let i = 0; i <= ctrl.numHorizontalLines; i++) {
        let x1 = randomIntUpTo(width);
        let w = randomIntRange(...ctrl.lineWidthRangeRelative) * width / 100;
        setRandomFillColor();
        ctx.fillRect(x1, 0, w, height);
    }
    for (let i = 0; i <= ctrl.numVerticalLines; i++) {
        let y1 = randomIntUpTo(width);
        let h = randomIntRange(...ctrl.lineWidthRangeRelative) * height / 100;
        setRandomFillColor();
        ctx.fillRect(0, y1, width, h);
    }
}
