'use strict';

function setupControls() {
    makeForm(
        makeFieldset('Tiles',
            makeSlider('tileCountX', 'Number of horizontal tiles: {0}', 1, 100, 30),
            makeSlider('tileCountY', 'Number of vertical tiles: {0}', 1, 100, 15),
            makeSlider('tileSizeMultiplier', 'Tile size multiplier: {0}', 1, 10, 3, 0.1),
        ),
        makeFieldset('Noise',
            makeSlider('noiseOffsetX', 'Horizontal noise offset: {0}', 0, 30, 4),
            makeSlider('noiseOffsetY', 'Vertical noise offset: {0}', 1, 100, 15),
            makeSlider('noiseDivisor', 'Noise divisor: {0}', 1, 30, 9),
        ),
        makeSlider('margin', 'Margin: {0}', 0, 200, 15, 5),
    );
}

function drawWork() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'white';

    let tileWidth = Math.floor((width - 2 * ctrl.margin) / ctrl.tileCountX);
    let tileHeight = Math.floor((height - 2 * ctrl.margin) / ctrl.tileCountY);

    for (let tileX = 0; tileX < ctrl.tileCountX; tileX++) {
        for (let tileY = 0; tileY < ctrl.tileCountY; tileY++) {
            ctx.save();

            let centerX = ctrl.margin + (tileX + 0.5) * tileWidth;
            let centerY = ctrl.margin + (tileY + 0.5) * tileHeight;
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
