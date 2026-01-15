'use strict';

let createdDate = '2022.09.25';

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

function drawWork() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);


    let tileDim = Math.floor(width / ctrl.numTiles);
    for (let x = 0; x < ctrl.numTiles; x++) {
        for (let y = 0; y < ctrl.numTiles; y++) {
            ctx.save();
            ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);

            let numColors = randomIntRange(...ctrl.numColorsRange);
            let palette = chroma.scale(ctrl.colorMap).colors(numColors);
            let numSides = randomIntRange(...ctrl.numSidesRange);
            let points = getPointsForPolygon(numSides, tileDim * 0.9, 0);

            // draw a line from each point to each point
            let colorIndex = 0;
            points.forEach((p, i) => {
                points.forEach((p2, j) => {
                    if (i == j) return;
                    ctx.strokeStyle = palette[colorIndex];
                    colorIndex = (colorIndex + 1 + palette.length) % palette.length;
                    ctx.beginPath();
                    ctx.moveTo(...p);
                    ctx.lineTo(...p2);
                    ctx.stroke();
                });
            });

            ctx.restore();
        }
    }

}
