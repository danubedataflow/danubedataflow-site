'use strict';

function setupControls() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 2, 32, 16),
        ),
        makeSlider('numSides', 3, 50, 10),
    );
}

function drawSketch() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    let points = getPointsForPolygon(ctrl.numSides, width * 0.9, 0);

    // draw a line from each point to each point
    let colorIndex = 0;
    points.forEach((p, i) => {
        points.forEach((p2, j) => {
            if (i == j) return;
            ctx.strokeStyle = palette[colorIndex];
            colorIndex = (colorIndex + 1 + palette.length) % palette.length;
            line(p, p2);
            ctx.stroke();
        });
    });
    ctx.restore();
}
