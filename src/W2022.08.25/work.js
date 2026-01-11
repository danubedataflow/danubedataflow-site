'use strict';

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['lighter', 'source-over', 'difference', 'exclusion', 'hard-light', 'lighten', 'screen']),
        ),
        makeSlider('numLines', 'Number of lines: {0}', 1, 1500, 500),
    );
}

function drawSketch() {
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    let radius = width * 0.4;
    let angle = random() * 2 * Math.PI;
    let p = [Math.sin(angle) * radius, Math.cos(angle) * radius];
    let colorScale = chroma.scale(ctrl.colorMap);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    for (let i = 1; i <= ctrl.numLines; i++) {
        ctx.strokeStyle = colorScale(random()).toString();
        let angle2 = random() * 2 * Math.PI;
        let p2 = [Math.sin(angle2) * radius, Math.cos(angle2) * radius];
        ctx.beginPath();
        ctx.moveTo(...p);
        ctx.lineTo(...p2);
        ctx.stroke();
        p = p2;
    }
    ctx.restore();
}
