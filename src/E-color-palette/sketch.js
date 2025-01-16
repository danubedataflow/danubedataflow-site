'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 3, 10, 5),
    );
}

function drawSketch() {
    let size = width / ctrl.numTiles;
    for (let i = 0; i < ctrl.numTiles; i++) {
        for (let j = 0; j < ctrl.numTiles; j++) {
            ctx.fillStyle = `rgb(
        ${Math.floor(255 - (255 / ctrl.numTiles) * i)}
        ${Math.floor(255 - (255 / ctrl.numTiles) * j)}
        0)`;
            ctx.fillRect(j * size, i * size, size, size);
        }
    }
}
