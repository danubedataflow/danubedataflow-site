'use strict';

function drawSketch() {
    pixelDensity(1);
    let img = createImage(width, height);
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            img.set(x, y, color(random(255)));
        }
    }
    img.updatePixels();
    img.resize(width * pixelDensity(), height * pixelDensity());
    image(img, 0, 0);
}