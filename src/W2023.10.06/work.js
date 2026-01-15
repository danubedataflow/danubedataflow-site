'use strict';

let createdDate = '2023.10.06';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 3),
        makeSlider('lineGap', 'Distance of initial points: {0}', 5, 100, 50),
        makeSlider('maxMovement', 'Maximum movement: {0}', 5, 20, 10),
    );
}

function drawWork() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            ctx.scale(0.9, 0.9);
            drawWalkers(tileDim);
            ctx.rotate(Math.PI / 2);
            drawWalkers(tileDim);

            ctx.restore();
        }
    }
}

function drawWalkers(tileDim) {
    ctx.save();
    ctx.translate(-tileDim / 2, -tileDim / 2);
    for (let startY = 0; startY <= tileDim; startY += ctrl.lineGap) {
        let y = startY;

        ctx.fillStyle = colorRGBA(randomIntUpTo(255), randomIntUpTo(255), randomIntUpTo(255), 0.2);

        /* Make a shape that borders the left, top and right side; the bottom
         * is determined by the walker. We use a random semitransparent fill
         * for each shape so each intersecting shape of adjacent horizontal and
         * vertical walkers is filled by a color that is related to its
         * neighbors.
         */
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= tileDim; x += ctrl.maxMovement) {
            ctx.lineTo(x, y);

            // random movement but constrain to the tile size
            y += randomIntPlusMinus(ctrl.maxMovement);
            if (y < 0) y = 0;
            if (y > tileDim) y = tileDim;
        }
        ctx.lineTo(tileDim, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // draw a border
    ctx.strokeRect(0, 0, tileDim, tileDim);
    ctx.restore();
}
