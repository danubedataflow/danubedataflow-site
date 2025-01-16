'use strict';

function setupControls() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['lighter', 'source-over', 'difference', 'exclusion', 'hard-light', 'lighten', 'screen']),
        ),
        makeSlider('numLines', 1, 1500, 500),
    );
}

function drawSketch() {
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;
    let colorScale = chroma.scale(ctrl.colorMap);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    for (let i = 1; i <= ctrl.numLines; i++) {
        let radius = width * 0.4;
        let angle = random() * 2 * Math.PI;

        ctx.strokeStyle = colorScale(random()).toString();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
        ctx.stroke();
    }
    ctx.restore();
}
