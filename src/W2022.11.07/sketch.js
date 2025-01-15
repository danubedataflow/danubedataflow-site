'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 4, 40, 20),
        makeSlider('horizontalLineChance', 0, 100, 30),
        makeSlider('verticalLineChance', 0, 100, 30),
        makeSlider('diagonalUpwardsLineChance', 0, 100, 30),
        makeSlider('diagonalDownwardsLineChance', 0, 100, 30),
        makeCheckbox('hasTileBorder'),
    );
}

function drawSketch() {
    ctx.save();
    padSketch();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            ctx.translate((x - 1) * dim, (y - 1) * dim);

            if (ctrl.hasTileBorder) ctx.strokeRect(0, 0, dim, dim);
            if (randomIntUpTo(100) < ctrl.horizontalLineChance) drawLine(0, dim / 2, dim, dim / 2);
            if (randomIntUpTo(100) < ctrl.verticalLineChance) drawLine(dim / 2, 0, dim / 2, dim);
            if (randomIntUpTo(100) < ctrl.diagonalUpwardsLineChance) drawLine(0, dim, dim, 0);
            if (randomIntUpTo(100) < ctrl.diagonalDownwardsLineChance) drawLine(0, 0, dim, dim);

            ctx.restore();
        }
    }
    ctx.restore();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

}

