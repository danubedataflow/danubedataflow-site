'use strict';

function setupForm() {
    makeForm(
        makeSlider('horizontalSineFactor', 1, 5, 2.5, 0.1),
        makeSlider('alpha', 1, 100, 30),
        makeSlider('angleStep', 0.1, 10, 0.5, 0.1),
        makeSlider('squareSizeRange', 1, 100, [30, 50]),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = `rgba(0,0,0,${ ctrl.alpha / 100 })`;
    ctx.lineWidth = 1;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < 360; i += ctrl.angleStep) {

        let rad = i / 180 * Math.PI;

        // x-factor 2 produces the "infinity sign"

        let x = Math.sin(rad * ctrl.horizontalSineFactor) * (width / 3);
        let y = Math.sin(rad) * (height / 3);

        // Draw random squares around each point, drawn at 10% alpha, produces
        // a fuzzy shape.

        let dim = randomIntRange(...ctrl.squareSizeRange);
        ctx.strokeRect(x, y, dim, dim);
    }
    ctx.restore();
}
