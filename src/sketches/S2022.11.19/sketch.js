'use strict';

/* Generic function to create a color based on two controls: one for the color
 * (default name 'color') and one range for the alpha (default name 'alpha').
 */

function controlColorWithAlpha(colorControl = 'color', alphaControl = 'alpha') {
    let c = color(ctrl[colorControl]);
    c.setAlpha(int(random(...ctrl[alphaControl])));
    return c;
}

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('horizontalBars', 'Number of horizontal bars', 1, 10, 5),
        makeSlider('verticalBars', 'Number of vertical bars', 1, 10, 5),
        makeSlider('size', 'Size of bars in percent of canvas dimension', 1, 20, [9, 13]),
        makeFieldset('Color',
            makeSelect(
                'color',
                'Color', [
                    makeOption('black', 'Black'),
                    makeOption('red', 'Red'),
                    makeOption('green', 'Green'),
                    makeOption('blue', 'Blue'),
                ],
                'black'
            ),
            makeSlider('alpha', 'Alpha', 1, 255, [50, 200]),
        ),
    );
    noLoop();
}

function draw() {
    readControls();

    background('white');
    noStroke();
    fill('black');
    rectMode(CORNER);

    for (let i = 0; i <= ctrl.horizontalBars; i++) {
        let x1 = int(random(width));
        let w = int(random(...ctrl.size.map(x => x * width / 100)));
        fill(controlColorWithAlpha());
        rect(x1, 0, w, height);
    }
    for (let i = 0; i <= ctrl.verticalBars; i++) {
        let y1 = int(random(width));
        let h = int(random(...ctrl.size.map(x => x * height / 100)));
        fill(controlColorWithAlpha());
        rect(0, y1, width, h);
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
