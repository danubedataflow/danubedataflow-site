import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    shuffle
} from '/js/array.js';
let c;

function setupControls() {
    makeForm(
        makeFieldset('Repetitions',
            makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 12, 9),
            makeSlider('scale', 'Scale: {0}', 0.6, 1, 0.8, 0.05),
        ),
        makeSlider('numPointsPerSide', 'Number of points per side in a square: {0}', 4, 8, 4),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'black';
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.scale(c.ctrl.scale, c.ctrl.scale);
            let points = [];
            for (let py = 0; py < c.ctrl.numPointsPerSide; py++) {
                for (let px = 0; px < c.ctrl.numPointsPerSide; px++) {
                    points.push([
                        Math.round(px * tileDim / (c.ctrl.numPointsPerSide - 1) - tileDim / 2),
                        Math.round(py * tileDim / (c.ctrl.numPointsPerSide - 1) - tileDim / 2)
                    ]);
                }
            }
            points = shuffle(points);
            for (let i = 0; i < points.length - 1; i++) {
                c.ctx.beginPath();
                c.ctx.moveTo(...points[i]);
                c.ctx.lineTo(...points[i + 1]);
                c.ctx.stroke();
            }
            c.ctx.restore();
        }
    }
}
let description = `In each square tile, a grid of points is randomly connected by lines. Homage to "Hommage à Dürer" by haVera Molnár, which itself was based on the magic square from Albrecht Dürer's engraving "Melencolia I".`;
run({
    createdDate: '2023-09-21',
    description,
    setupControls,
    drawWork
});