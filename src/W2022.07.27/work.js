'use strict';

function setupControls() {

    makeForm(
        makeFieldset('Tiles',
            makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 50, 25),
            makeSlider('tileSizeMultiplier', 'Tile size multiplier: {0}', 1, 10, 3, 0.1),
        ),
        makeFieldset('Noise',
            makeSlider('noiseOffsetX', 'Horizontal noise offset: {0}', 0, 30, 4),
            makeSlider('noiseOffsetY', 'Vertical noise offset: {0}', 1, 100, 15),
            makeSlider('noiseDivisor', 'Noise divisor: {0}', 1, 30, 9),
        ),
    );
}

function drawWork() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'white';

    let tileWidth = Math.floor(width / ctrl.numTiles);
    let tileHeight = Math.floor(height / ctrl.numTiles);

    for (let tileX = 0; tileX < ctrl.numTiles; tileX++) {
        for (let tileY = 0; tileY < ctrl.numTiles; tileY++) {
            ctx.save();

            let centerX = (tileX + 0.5) * tileWidth;
            let centerY = (tileY + 0.5) * tileHeight;
            ctx.translate(centerX, centerY);

            let n = noise.simplex2(
                ctrl.noiseOffsetX + tileX / ctrl.noiseDivisor,
                ctrl.noiseOffsetY + tileY / ctrl.noiseDivisor
            );

            let diameter = Math.floor(n * ctrl.tileSizeMultiplier * Math.min(tileWidth, tileHeight));

            ctx.beginPath();
            let points = getPointsForPolygon(6, diameter, 30);
            points.forEach(p => ctx.lineTo(...p));
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }
    }
}
