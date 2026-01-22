import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    getPointsForPolygon
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 50, 25),
        makeFieldset('Polygon',
            makeSlider('numSides', 'Number of sides: {0}', 3, 8, 6),
            makeSlider('polygonScaleFactor', 'Scale factor: {0}', 1, 10, 3, 0.1),
        ),
        makeFieldset('Noise',
            makeSlider('noiseOffsetX', 'Horizontal noise offset: {0}', 0, 30, 4),
            makeSlider('noiseOffsetY', 'Vertical noise offset: {0}', 1, 100, 15),
            makeSlider('noiseDivisor', 'Noise divisor: {0}', 1, 30, 9),
        ),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'black';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'white';
    let tileDim = Math.floor(c.width / c.ctrl.numTiles);
    for (let x = 0; x < c.ctrl.numTiles; x++) {
        for (let y = 0; y < c.ctrl.numTiles; y++) {
            c.ctx.save();
            c.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            let n = noise.simplex2(
                c.ctrl.noiseOffsetX + x / c.ctrl.noiseDivisor,
                c.ctrl.noiseOffsetY + y / c.ctrl.noiseDivisor
            );
            let diameter = Math.floor(n * c.ctrl.polygonScaleFactor * tileDim);
            c.ctx.beginPath();
            let points = getPointsForPolygon(c.ctrl.numSides, diameter, 0);
            points.forEach(p => c.ctx.lineTo(...p));
            c.ctx.closePath();
            c.ctx.stroke();
            c.ctx.restore();
        }
    }
}
let description = `Draw a grid of polygons whose sizes depend on two-dimensional Perlin noise.`;
run({
    createdDate: '2022-07-27',
    description,
    setupControls,
    drawWork
});