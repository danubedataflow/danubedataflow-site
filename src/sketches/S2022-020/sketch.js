'use strict';

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('chanceHorizontal', 'Chance for a horizontal line (%)', 0, 100, 30),
    makeSlider('chanceVertical', 'Chance for a vertical line (%)', 0, 100, 30),
    makeSlider('chanceDiagoalUp', 'Chance for an upwards diagonal line (%)', 0, 100, 30),
    makeSlider('chanceDiagoalDown', 'Chance for an downwards diagonal line (%)', 0, 100, 30),
    makeCheckbox('tileBorder', 'Tile border'),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();

    strokeWeight(1);
    stroke('black');
    noFill();
    rectMode(CENTER);
    angleMode(DEGREES);

    background('white');
    simpleGrid({
        numTiles: ctrl.numTiles,
        margin: width / 10,
        callback: (config) => {
            let {
                dim
            } = config;
            if (ctrl.tileBorder) rect(0, 0, dim, dim);
            if (random(100) < ctrl.chanceHorizontal) line(-dim / 2, 0, dim / 2, 0);
            if (random(100) < ctrl.chanceVertical) line(0, -dim / 2, 0, dim / 2);
            if (random(100) < ctrl.chanceDiagoalUp) line(dim / 2, -dim / 2, -dim / 2, dim / 2);
            if (random(100) < ctrl.chanceDiagoalDown) line(-dim / 2, -dim / 2, dim / 2, dim / 2);
        }
    });
    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
