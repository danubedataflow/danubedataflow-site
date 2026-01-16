'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode
} from '/js/ui.js';
import {
    random,
    randomIntRange
} from '/js/math.js';

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

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    let angle = random() * 2 * Math.PI;
    let colorScale = chroma.scale(ctrl.colorMap);

    let tileDim = Math.floor(width / ctrl.numTiles);
    let radius = tileDim * 0.4;
    let p = [Math.sin(angle) * radius, Math.cos(angle) * radius];
    for (let x = 0; x < ctrl.numTiles; x++) {
        for (let y = 0; y < ctrl.numTiles; y++) {
            ctx.save();
            ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);

            let numLines = randomIntRange(...ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                ctx.strokeStyle = colorScale(random()).toString();
                let angle2 = random() * 2 * Math.PI;
                let p2 = [Math.sin(angle2) * radius, Math.cos(angle2) * radius];
                ctx.beginPath();
                ctx.moveTo(...p);
                ctx.lineTo(...p2);
                ctx.stroke();
                p = p2;
            }

            ctx.restore();
        }
    }

}

run({
    createdDate: '2022.08.25',
    setupControls,
    drawWork
});
