'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeSelectColorMap
} from '/js/ui.js';

/* based on the Mathologer video
 * "Times Tables, Mandelbrot and the Heart of Mathematics"
 * https://www.youtube.com/watch?v=qhbuKbxJsk8
 *
 * The modulus is the number of points on the circle.
 */

function setupControls() {
    makeForm(
        makeSelectColorMap(),

        makeSlider('modulus', 'Modulus: {0}', 10, 300, 100),
        makeSlider('timesTable', 'Times table: {0}', 2, 100, 10, 0.2),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.modulus);

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'exclusion';

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
        ctx.moveTo(Math.sin(angle(i, ctrl.modulus)) * radius, Math.cos(angle(i, ctrl.modulus)) * radius);
        ctx.lineTo(Math.sin(angle(j, ctrl.modulus)) * radius, Math.cos(angle(j, ctrl.modulus)) * radius);
        ctx.stroke();
    }
    ctx.restore();
}

function angle(n, modulus) {
    return n * Math.PI * 2 / modulus;
}

let description = `No description yet.`;

run({
    createdDate: '2022.10.06',
    description,
    setupControls,
    drawWork
});
