'use strict';

function setupControls() {
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

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    padSketch();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            ctx.translate((x - 1) * dim, (y - 1) * dim);

            if (ctrl.hasTileBorder) ctx.strokeRect(0, 0, dim, dim);

            if (randomIntUpTo(100) < ctrl.horizontalLineChance) {
                line([0, dim / 2], [dim, dim / 2]);
                ctx.stroke();
            }

            if (randomIntUpTo(100) < ctrl.verticalLineChance) {
                line([dim / 2, 0], [dim / 2, dim]);
                ctx.stroke();
            }

            if (randomIntUpTo(100) < ctrl.diagonalUpwardsLineChance) {
                line([0, dim], [dim, 0]);
                ctx.stroke();
            }

            if (randomIntUpTo(100) < ctrl.diagonalDownwardsLineChance) {
                line([0, 0], [dim, dim]);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
    ctx.restore();
}
