'use strict';

function setupForm() {
    makeForm(
        makeSlider('horizontalBars', 'Anzahl der horizontalen Striche', 1, 10, 5),
        makeSlider('verticalBars', 'Anzahl der vertikalen Striche', 1, 10, 5),
        makeSlider('size', 'Strichdicke als Prozentsatz der Leinwandgröße', 1, 20, [9, 13]),
        makeFieldset('colors',
            makeSlider('colorAngle', 'Winkel auf dem Farbenkreis', 0, 359, 0),
            makeSlider('saturation', 'Farbsättigung', 40, 100, [60, 80]),
            makeSlider('brightness', 'Helligkeit', 40, 100, [60, 80]),
            makeSlider('alphaRange', 'XXX', 1, 255, [50, 200]),
        ),
    );
}

function setRandomFillColor() {
    fill(
        ctrl.colorAngle,
        randomIntRange(...ctrl.saturation),
        randomIntRange(...ctrl.brightness),
        randomIntRange(...ctrl.alphaRange)
    );
}

function drawSketch() {
    background('white');
    noStroke();
    fill('black');
    colorMode(HSB, 360, 100, 100, 100);

    for (let i = 0; i <= ctrl.horizontalBars; i++) {
        let x1 = int(random(width));
        let w = int(random(...ctrl.size.map(x => x * width / 100)));
        setRandomFillColor();
        rect(x1, 0, x1 + w, height);
    }
    for (let i = 0; i <= ctrl.verticalBars; i++) {
        let y1 = int(random(width));
        let h = int(random(...ctrl.size.map(x => x * height / 100)));
        setRandomFillColor();
        rect(0, y1, width, y1 + h);
    }
}
