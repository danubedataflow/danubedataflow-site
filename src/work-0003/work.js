'use strict';

let createdDate = '2022.08.19';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeSelectColorMap(),
        makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
    );
}

function drawWork() {
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    let colorScale = chroma.scale(ctrl.colorMap);

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            // `+ 0.5` to move to the tile's center
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            let radius = tileDim * 0.4;
            let numLines = randomIntRange(...ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                ctx.strokeStyle = colorScale(random()).toString();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                let angle = random() * 2 * Math.PI;
                ctx.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}
