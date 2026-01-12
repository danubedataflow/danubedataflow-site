'use strict';

function setupControls() {
    makeForm();
}

function drawWork() {
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let grey = randomIntUpTo(255);
        imageData.data[i + 0] = grey; // R value
        imageData.data[i + 1] = grey; // G value
        imageData.data[i + 2] = grey; // B value
        imageData.data[i + 3] = 255; // A value
    }

    ctx.putImageData(imageData, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.drawImage(ctx.canvas, 0, 0);
}
