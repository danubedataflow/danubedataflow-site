import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorHSLA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numHorizontalLines', 'Number of horizonal lines: {0}', 1, 10, 5),
        makeSlider('numVerticalLines', 'Number of vertical lines: {0}', 1, 10, 5),
        makeSlider('lineWidthRangeRelative', 'Line c.width range: {0}% to {1}% of the canvas', 1, 20, [9, 13]),
        makeFieldset('Colors',
            makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
            makeSlider('saturationRange', 'Saturation range: {0} to {1}', 40, 100, [60, 80]),
            makeSlider('lightnessRange', 'Ligntness range: {0} to {1}', 40, 100, [60, 80]),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 1, 100, [20, 80]),
        ),
    );
}

function setRandomFillColor() {
    c.ctx.fillStyle = colorHSLA(
        c.ctrl.colorAngle,
        randomIntRange(...c.ctrl.saturationRange),
        randomIntRange(...c.ctrl.lightnessRange),
        randomIntRange(...c.ctrl.alphaRange) / 100
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.fillStyle = 'black';
    for (let i = 0; i <= c.ctrl.numHorizontalLines; i++) {
        let x1 = randomIntUpTo(c.width);
        let w = randomIntRange(...c.ctrl.lineWidthRangeRelative) * c.width / 100;
        setRandomFillColor();
        c.ctx.fillRect(x1, 0, w, c.height);
    }
    for (let i = 0; i <= c.ctrl.numVerticalLines; i++) {
        let y1 = randomIntUpTo(c.width);
        let h = randomIntRange(...c.ctrl.lineWidthRangeRelative) * c.height / 100;
        setRandomFillColor();
        c.ctx.fillRect(0, y1, c.width, h);
    }
}
let description = `Horizontal and vertical lines with random positions and random colors.`;
run({
    createdDate: '2022-11-19',
    description,
    setupControls,
    drawWork
});