import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('horizontalSineFactor', 'Horizontal sine factor: {0}', 1, 5, 2.5, 0.1),
        makeSlider('alpha', 'Transparency (alpha): {0}', 1, 100, 30),
        makeSlider('angleStep', 'Angle step: {0}', 0.1, 10, 0.5, 0.1),
        makeSlider('squareSizeRange', 'Square size range: {0} to {1}', 1, 100, [30, 50]),
    );
}

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = colorRGBA(0, 0, 0, c.ctrl.alpha / 100);
    c.ctx.lineWidth = 1;
    c.ctx.save();
    c.ctx.translate(c.width / 2, c.height / 2);
    for (let i = 0; i < 360; i += c.ctrl.angleStep) {
        let rad = i / 180 * Math.PI;
        // x-factor 2 produces the "infinity sign"
        let x = Math.sin(rad * c.ctrl.horizontalSineFactor) * (c.width / 3);
        let y = Math.sin(rad) * (c.height / 3);
        // Draw random squares around each point at 10% alpha, produces a fuzzy
        // shape.
        let dim = randomIntRange(...c.ctrl.squareSizeRange);
        c.ctx.strokeRect(x, y, dim, dim);
    }
    c.ctx.restore();
}
let description = `Rectangles are drawn along a modified sine wave.`;
run({
    createdDate: '2022-11-02',
    description,
    setupControls,
    drawWork
});
