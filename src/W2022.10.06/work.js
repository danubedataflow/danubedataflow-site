'use strict';

/* based on the Mathologer video
 * "Times Tables, Mandelbrot and the Heart of Mathematics"
 * https://www.youtube.com/watch?v=qhbuKbxJsk8
 */

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'darken', 'difference', 'exclusion', 'hard-light', 'multiply']),
        ),
        // the modulus is the number of points on the circle
        makeSlider('modulus', 'Modulus: {0}', 10, 300, 100),
        makeSlider('timesTable', 'Times table: {0}', 2, 100, 10, 0.2),
    );
}

function drawSketch() {
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.modulus);

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, width, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const radius = width / 2;
    for (let i = 0; i < ctrl.modulus; i++) {

        // cycle through all colors in the palette; wrap around
        const colorIndex = (i + palette.length) % palette.length;
        ctx.strokeStyle = palette[colorIndex];

        let j = i * ctrl.timesTable;
        ctx.beginPath();
        ctx.moveTo(Math.sin(angle(i)) * radius, Math.cos(angle(i)) * radius);
        ctx.lineTo(Math.sin(angle(j)) * radius, Math.cos(angle(j)) * radius);
        ctx.stroke();
    }
    ctx.restore();
}

function angle(n) {
    return n * Math.PI * 2 / ctrl.modulus;
}
