'use strict';

function setupControls() {
    makeForm(
        makeSlider('numHorizontalLines', 'Number of horizonal lines: {0}', 1, 10, 5),
        makeSlider('numVerticalLines', 'Number of vertical lines: {0}', 1, 10, 5),
        makeSlider('lineWidthRangeRelative', 'Stroke weight range: {0}% to {1}% of the canvas', 1, 20, [9, 13]),
        makeFieldset('Colors',
            makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
            makeSlider('saturationRange', 'Saturation range: {0} to {1}', 40, 100, [60, 80]),
            makeSlider('lightnessRange', 'Ligntness range: {0} to {1}', 40, 100, [60, 80]),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 1, 100, [20, 80]),
        ),
    );
}

function setRandomFillColor() {
    ctx.fillStyle = colorHSLA(
        ctrl.colorAngle,
        randomIntRange(...ctrl.saturationRange),
        randomIntRange(...ctrl.lightnessRange),
        randomIntRange(...ctrl.alphaRange) / 100
    );
}

function drawWork() {
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
