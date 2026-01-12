'use strict';

let palette;

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 32, 16),
        ),
        makeSlider('coloredTileChance', 'Probability of a colored tile: {0}%', 0, 100, 50),
        makeSlider('coloredDiamondChance', 'Probability of a colored rhombus: {0}%', 0, 100, 50),
        makeSlider('numTilesX', 'Number of horizontal tiles: {0}', 4, 40, 10),
        makeSlider('numTilesY', 'Number of vertical tiles: {0}', 4, 40, 10),
    );
}

function drawWork() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    let tileWidth = width / ctrl.numTilesX;
    let tileHeight = height / ctrl.numTilesY;
    for (let y = 1; y <= ctrl.numTilesY; y++) {
        for (let x = 1; x <= ctrl.numTilesX; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileWidth, (y - 0.5) * tileHeight);

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredTileChance ? palette.randomElement() : 'white';
            ctx.fillRect(-tileWidth / 2, -tileHeight / 2, tileWidth, tileHeight);

            // draw triangles

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            ctx.beginPath();
            ctx.moveTo(0, -tileHeight / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(-tileWidth / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            ctx.beginPath();
            ctx.moveTo(0, -tileHeight / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(tileWidth / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            ctx.beginPath();
            ctx.moveTo(0, tileHeight / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(-tileWidth / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            ctx.beginPath();
            ctx.moveTo(0, tileHeight / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(tileWidth / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }
}
