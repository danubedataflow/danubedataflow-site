import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    clearCanvas
} from '/js/ui.js';
import {
    random,
    randomIntRange,
    getPointsForPolygon
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColorsRange', 'Number of colors: {0} to {1}', 2, 32, [12, 20]),
        ),
        makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 50, [8, 15]),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas('black');
    let tileDim = Math.floor(c.width / c.ctrl.numTiles);
    for (let x = 0; x < c.ctrl.numTiles; x++) {
        for (let y = 0; y < c.ctrl.numTiles; y++) {
            c.ctx.save();
            c.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            let numColors = randomIntRange(...c.ctrl.numColorsRange);
            let palette = chroma.scale(c.ctrl.colorMap).colors(numColors);
            let numSides = randomIntRange(...c.ctrl.numSidesRange);
            let points = getPointsForPolygon(numSides, tileDim * 0.9, 0);
            // draw a line from each point to each point
            let colorIndex = 0;
            points.forEach((p, i) => {
                points.forEach((p2, j) => {
                    if (i == j) return;
                    c.ctx.strokeStyle = palette[colorIndex];
                    colorIndex = (colorIndex + 1 + palette.length) % palette.length;
                    c.ctx.beginPath();
                    c.ctx.moveTo(...p);
                    c.ctx.lineTo(...p2);
                    c.ctx.stroke();
                });
            });
            c.ctx.restore();
        }
    }
}
let description = `Different polygons. Each points on a polygon is connected to all other points, using a random color.`
run({
    createdDate: '2022-09-25',
    description,
    setupControls,
    drawWork
});
