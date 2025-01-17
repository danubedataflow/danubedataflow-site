'use strict';

let palette;

function setupControls() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 2, 32, 16),
        ),
        makeSlider('coloredTileChance', 0, 100, 50),
        makeSlider('coloredDiamondChance', 0, 100, 50),
        makeSlider('numTilesX', 4, 40, 10),
        makeSlider('numTilesY', 4, 40, 10),
    );
}

function drawSketch() {
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

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            triangle([0, -tileHeight / 2], [0, 0], [-tileWidth / 2, 0]);
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            triangle([0, -tileHeight / 2], [0, 0], [tileWidth / 2, 0]);
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            triangle([0, tileHeight / 2], [0, 0], [-tileWidth / 2, 0]);
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
            triangle([0, tileHeight / 2], [0, 0], [tileWidth / 2, 0]);
            ctx.fill();

            ctx.restore();
        }
    }
}
