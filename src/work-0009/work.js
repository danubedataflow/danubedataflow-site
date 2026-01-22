import {
    run,
    makeForm,
    makeSlider,
    makeSelectColorMap
} from '/js/ui.js';
let c;

function setupControls() {
    makeForm(
        makeSelectColorMap(),
        makeSlider('modulus', 'Modulus: {0}', 10, 300, 100),
        makeSlider('timesTable', 'Mulitply each point value by: {0}', 2, 100, 10, 0.2),
    );
}

function drawWork(config) {
    c = config;

    // actually clear the canvas
    c.ctx.globalCompositeOperation = 'source-over';
    c.ctx.fillStyle = '#cccccc';
    c.ctx.fillRect(0, 0, c.width, c.height);

    c.ctx.globalCompositeOperation = 'exclusion';
    c.ctx.fillStyle = 'white';
    c.ctx.lineWidth = 1;
    c.ctx.save();
    c.ctx.translate(c.width / 2, c.height / 2);
    c.ctx.beginPath();
    c.ctx.arc(0, 0, c.width, 0, Math.PI * 2);
    c.ctx.fill();
    c.ctx.stroke();
    const radius = c.width / 2;
    let palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.modulus);

    for (let i = 0; i < c.ctrl.modulus; i++) {
        // cycle through all colors in the palette; wrap around
        const colorIndex = (i + palette.length) % palette.length;
        c.ctx.strokeStyle = palette[colorIndex];
        let j = i * c.ctrl.timesTable;
        c.ctx.beginPath();
        c.ctx.moveTo(Math.sin(angle(i, c.ctrl.modulus)) * radius, Math.cos(angle(i, c.ctrl.modulus)) * radius);
        c.ctx.lineTo(Math.sin(angle(j, c.ctrl.modulus)) * radius, Math.cos(angle(j, c.ctrl.modulus)) * radius);
        c.ctx.stroke();
    }
    c.ctx.restore();
}

function angle(n, modulus) {
    return n * Math.PI * 2 / modulus;
}
let description = `Points along a circle correspond to the modulus. For each point, its value is multiplied by the given number, then a line is drawn from the point to the point corresponding to the the modulus remainder. Based on the Mathologer video <a href="https://www.youtube.com/watch?v=qhbuKbxJsk8">Times Tables, Mandelbrot and the Heart of Mathematics</a>. The modulus is the number of points on the circle.`;
run({
    createdDate: '2022-10-06',
    description,
    setupControls,
    drawWork
});
