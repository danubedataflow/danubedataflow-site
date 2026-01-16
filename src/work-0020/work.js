'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';

let palette;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 10),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 32, 16),
        ),
        makeSlider('coloredTileChance', 'Probability of a colored tile: {0}%', 0, 100, 50),
        makeSlider('coloredDiamondChance', 'Probability of a colored rhombus: {0}%', 0, 100, 50),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredTileChance ? randomElement(palette) : 'white';
            ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);

            // draw triangles

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            ctx.beginPath();
            ctx.moveTo(0, -tileDim / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(-tileDim / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            ctx.beginPath();
            ctx.moveTo(0, -tileDim / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(tileDim / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            ctx.beginPath();
            ctx.moveTo(0, tileDim / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(-tileDim / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            ctx.beginPath();
            ctx.moveTo(0, tileDim / 2);
            ctx.lineTo(0, 0);
            ctx.lineTo(tileDim / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }
}

let description = `No description yet.`;

run({
    createdDate: '2023.04.27',
    description,
    setupControls,
    drawWork
});
