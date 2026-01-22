import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntRange,
    getPointsForPolygon
} from '/js/math.js';
let c;
const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 7, [4, 6]),
        makeSlider('diameterRange', 'Diameter: {0} to {1}', 1, 100, [30, 50]),
        makeSlider('rotationStepRange', 'Rotation step: {0} to {1}', 0, 360, [150, 210]),
        makeSlider('maxDepthRange', 'Maximum depth: {0} to {1}', 1, 2, [1, 2]),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas();
    c.ctx.lineWidth = 1;
    c.ctx.strokeStyle = 'black';
    let tileDim = Math.floor(c.width / c.ctrl.numTiles);
    for (let x = 0; x < c.ctrl.numTiles; x++) {
        for (let y = 0; y < c.ctrl.numTiles; y++) {
            c.ctx.save();
            c.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            let numSides = randomIntRange(...c.ctrl.numSidesRange);
            let diameter = randomIntRange(...c.ctrl.diameterRange);
            let rotationStep = randomIntRange(...c.ctrl.rotationStepRange);
            let maxDepth = randomIntRange(...c.ctrl.maxDepthRange);
            drawPolygons(0, 0, numSides, diameter * tileDim / 100,
                0, rotationStep, maxDepth);
            c.ctx.restore();
        }
    }
}

function drawPolygons(x, y, sides, diameter, rotation, rotationStep, maxDepth = 0, depth = 0) {
    let points = getPointsForPolygon(sides, diameter, rotation);
    points.forEach(p => {
        c.ctx.save();
        c.ctx.translate(...p);
        c.ctx.beginPath();
        points.forEach(p => c.ctx.lineTo(...p));
        c.ctx.closePath();
        c.ctx.stroke();
        if (depth < maxDepth) {
            drawPolygons(p.x, p.y, sides, diameter,
                rotation + rotationStep / sides, rotationStep, maxDepth, depth + 1);
        }
        c.ctx.restore();
    });
}
let description = `Polygons at points of polygons at points of polygons, recursively up to the given depth.`;
run({
    createdDate: '2022-10-01',
    description,
    setupControls,
    drawWork
});
