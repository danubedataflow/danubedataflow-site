import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
let c, palette;

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

function drawWork(config) {
    c = config;
    clearCanvas();
    palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so any rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            // fill whole tile
            c.ctx.fillStyle = randomIntUpTo(100) < c.ctrl.coloredTileChance ? randomElement(palette) : 'white';
            c.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
            // draw triangles
            // upper left quadrant, diagonally sliced, inner triangle
            c.ctx.fillStyle = randomIntUpTo(100) < c.ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            c.ctx.beginPath();
            c.ctx.moveTo(0, -tileDim / 2);
            c.ctx.lineTo(0, 0);
            c.ctx.lineTo(-tileDim / 2, 0);
            c.ctx.closePath();
            c.ctx.fill();
            // upper right quadrant, diagonally sliced, inner triangle
            c.ctx.fillStyle = randomIntUpTo(100) < c.ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            c.ctx.beginPath();
            c.ctx.moveTo(0, -tileDim / 2);
            c.ctx.lineTo(0, 0);
            c.ctx.lineTo(tileDim / 2, 0);
            c.ctx.closePath();
            c.ctx.fill();
            // lower left quadrant, diagonally sliced, inner triangle
            c.ctx.fillStyle = randomIntUpTo(100) < c.ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            c.ctx.beginPath();
            c.ctx.moveTo(0, tileDim / 2);
            c.ctx.lineTo(0, 0);
            c.ctx.lineTo(-tileDim / 2, 0);
            c.ctx.closePath();
            c.ctx.fill();
            // lower right quadrant, diagonally sliced, inner triangle
            c.ctx.fillStyle = randomIntUpTo(100) < c.ctrl.coloredDiamondChance ? randomElement(palette) : 'white';
            c.ctx.beginPath();
            c.ctx.moveTo(0, tileDim / 2);
            c.ctx.lineTo(0, 0);
            c.ctx.lineTo(tileDim / 2, 0);
            c.ctx.closePath();
            c.ctx.fill();
            c.ctx.restore();
        }
    }
}
let description = `Each tile has a random color. The maximum inscribed diamond shape is sliced into four triangles that meet at the center. Each triangle gets a separate random color, overlaid on the tile background. Homage to Emma Biggs and Matthew Collings.`;
run({
    createdDate: '2023-04-27',
    description,
    setupControls,
    drawWork
});
