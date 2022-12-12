'use strict';

makeForm(
    makeFieldset('Tiles',
        makeSlider('tileCountX', 'Horizontal tiles', 1, 100, 30),
        makeSlider('tileCountY', 'Vertical tiles', 1, 100, 15),
        makeSlider('tileSizeMultiplier', 'Tile size multiplier', 1, 10, 3, 0.1),
    ),
    makeFieldset('Noise',
        makeSlider('noiseOffsetX', 'Horizontal noise offset', 0, 30, 4),
        makeSlider('noiseOffsetY', 'Vertical noise offset', 1, 100, 15),
        makeSlider('noiseDivisor', 'Noise divisor', 1, 30, 9),
    ),
    makeSlider('margin', 'Margin', 0, 200, 15, 5),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();
    background('black');
    stroke('white');
    noFill();

    let tileWidth = Math.floor((width - 2 * ctrl.margin) / ctrl.tileCountX);
    let tileHeight = Math.floor((height - 2 * ctrl.margin) / ctrl.tileCountY);

    for (let tileX = 0; tileX < ctrl.tileCountX; tileX++) {
        for (let tileY = 0; tileY < ctrl.tileCountY; tileY++) {
            push();

            let centerX = ctrl.margin + (tileX + 0.5) * tileWidth;
            let centerY = ctrl.margin + (tileY + 0.5) * tileHeight;
            translate(centerX, centerY);

            let n = noise(
                ctrl.noiseOffsetX + tileX / ctrl.noiseDivisor,
                ctrl.noiseOffsetY + tileY / ctrl.noiseDivisor
            );

            let diameter = Math.floor(n * ctrl.tileSizeMultiplier * Math.min(tileWidth, tileHeight));

            beginShape();
            let points = getPointsForPolygon(6, diameter, 30);
            points.forEach(p => vertex(...p));
            endShape(CLOSE);

            pop();
        }
    }
    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
