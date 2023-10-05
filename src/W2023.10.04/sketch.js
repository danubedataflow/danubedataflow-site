'use strict';

function setupForm() {
    makeForm(
        makeSlider('resolutionFactor', 'Auflösung', 4, 16, 10),
        makeSlider('lineDensity', 'Liniendichte', 3, 8, 5),
        makeSlider('rotation', 'Rotation', 0, 270, 0, 90),
    );
}

function drawSketch() {
    let pgDim = width / ctrl.resolutionFactor;
    let pg = createGraphics(pgDim, pgDim);

    canvas.imageSmoothingEnabled = false;
    pg.noSmooth();
    pg.strokeWeight(1);
    pg.stroke(0, 255, 0);
    pg.pixelDensity(1);
    pg.background('black');

    for (let y = 0; y <= 2 * pg.height; y += pg.height / ctrl.lineDensity) {
        pg.line(0, 0, pg.width, y);
        pg.line(pg.width, 0, 0, y);
    }
    translate(width / 2, height / 2);
    rotate(ctrl.rotation);
    translate(-width / 2, -height / 2);

    imageMode(CORNER);
    image(pg, 0, 0, width, height);
}
