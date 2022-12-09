'use strict';

const config = new Config()
    .maxIterations(-1);

makeForm(
    makeSlider('xyMultiplier', 'X/Y multiplier', 1, 300, 150),
    makeSlider('zDivisor', 'Z divisor', 1, 300, 150),
);

function initSketch() {
    pixelDensity(1);
}

function drawSketch() {
    let img = createImage(width, height);
    var yoff = 0;
    for (let y = 0; y < img.height; y++) {
        var xoff = 0;
        for (let x = 0; x < img.width; x++) {
            var index = (x + y * width) * 4;
            let n = noise(xoff, yoff, 5 * currentIteration / ctrl.zDivisor) * 255;
            img.set(x, y, n);
            xoff += ctrl.xyMultiplier * 0.001;
        }
        yoff += ctrl.xyMultiplier * 0.001;
    }

    img.updatePixels();
    img.resize(width * pixelDensity(), height * pixelDensity());
    image(img, 0, 0);
}
