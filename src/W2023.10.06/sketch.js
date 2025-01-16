'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 1, 5, 3),
        makeSlider('lineGap', 5, 100, 50),
        makeSlider('maxMovement', 5, 20, 10),
    );
}

function drawSketch() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
    ctx.restore();
}

function drawTile(tile) {
    ctx.scale(0.9, 0.9);
    drawWalkers(tile);
    ctx.rotate(Math.PI / 2);
    drawWalkers(tile);
}

function drawWalkers(tile) {
    ctx.save();
    ctx.translate(...tile.upperLeft);
    for (let startY = 0; startY <= tile.height; startY += ctrl.lineGap) {
        let y = startY;

        let r = randomIntUpTo(255);
        let g = randomIntUpTo(255);
        let b = randomIntUpTo(255);
        ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;

        /* Make a shape that borders the left, top and right side; the bottom
         * is determined by the walker. We use a random semitransparent fill
         * for each shape so each intersecting shape of adjacent horizontal and
         * vertical walkers is filled by a color that is related to its
         * neighbors.
         */
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= tile.width; x += ctrl.maxMovement) {
            ctx.lineTo(x, y);

            // random movement but constrain to the tile size
            y += randomIntPlusMinus(ctrl.maxMovement);
            if (y < 0) y = 0;
            if (y > tile.height) y = tile.height;
        }
        ctx.lineTo(tile.width, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // draw a border
    ctx.strokeRect(0, 0, tile.width, tile.height);
    ctx.restore();
}
