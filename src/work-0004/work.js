import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode,
    clearCanvas
} from '/js/ui.js';
import {
    random,
    randomIntRange
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['lighter', 'source-over', 'difference', 'exclusion', 'hard-light', 'lighten', 'screen']),
        ),
        makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas('black');
    c.ctx.globalCompositeOperation = c.ctrl.blendMode;
    let angle = random() * 2 * Math.PI;
    let colorScale = chroma.scale(c.ctrl.colorMap);
    let tileDim = Math.floor(c.width / c.ctrl.numTiles);
    let radius = tileDim * 0.4;
    let p = [Math.sin(angle) * radius, Math.cos(angle) * radius];
    for (let x = 0; x < c.ctrl.numTiles; x++) {
        for (let y = 0; y < c.ctrl.numTiles; y++) {
            c.ctx.save();
            c.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            let numLines = randomIntRange(...c.ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                c.ctx.strokeStyle = colorScale(random()).toString();
                let angle2 = random() * 2 * Math.PI;
                let p2 = [Math.sin(angle2) * radius, Math.cos(angle2) * radius];
                c.ctx.beginPath();
                c.ctx.moveTo(...p);
                c.ctx.lineTo(...p2);
                c.ctx.stroke();
                p = p2;
            }
            c.ctx.restore();
        }
    }
}
let description = `A random number of lines from one point on a circle to a random point on the same circle. This becomes the starting point of the next line.`;
run({
    createdDate: '2022-08-25',
    description,
    setupControls,
    drawWork
});
