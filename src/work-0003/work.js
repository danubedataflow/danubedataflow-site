import {
    run,
    makeForm,
    makeSlider,
    makeSelectColorMap
} from '/js/ui.js';
import {
    random,
    randomIntRange
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeSelectColorMap(),
        makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
    );
}

function drawWork(config) {
    c = config;
    // actually clear the canvas
    c.ctx.globalCompositeOperation = 'source-over';
    c.ctx.fillStyle = 'black';
    c.ctx.fillRect(0, 0, c.width, c.height);
    let colorScale = chroma.scale(c.ctrl.colorMap);
    let tileDim = Math.floor(c.width / c.ctrl.numTiles);
    let radius = tileDim * 0.4;
    for (let x = 0; x < c.ctrl.numTiles; x++) {
        for (let y = 0; y < c.ctrl.numTiles; y++) {
            c.ctx.save();
            c.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            let numLines = randomIntRange(...c.ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                c.ctx.strokeStyle = colorScale(random()).toString();
                c.ctx.beginPath();
                c.ctx.moveTo(0, 0);
                let angle = random() * 2 * Math.PI;
                c.ctx.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
                c.ctx.stroke();
            }
            c.ctx.restore();
        }
    }
}
let description = `A random number of lines from a central point to a point on a circle at a random angle.`;
run({
    createdDate: '2022-08-13',
    description,
    setupControls,
    drawWork
});