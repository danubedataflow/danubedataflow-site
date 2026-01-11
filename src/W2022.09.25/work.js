'use strict';

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 32, 16),
        ),
        makeSlider('numSides', 'Number of sides: {0}', 3, 50, 10),
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
            ctx.beginPath();
            ctx.moveTo(...p);
            ctx.lineTo(...p2);
            ctx.stroke();
        });
    });
    ctx.restore();
}
