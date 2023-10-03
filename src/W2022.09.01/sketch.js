'use strict';

const unicodeShapes = [
    '\u25EF', // ◯
    '\u25A2', // ▢
    '\u25C7', // ◇
    '\u25B7', // ▷
    '\u23AF', // ⎯
    '\u2572', // ╲
    '\u253C', // ┼
    '\u2573', // ╳
];

function createShapeCheckboxControl() {
    let ulEl = document.createElement('ul');
    ulEl.setAttribute('class', 'shapeCheckboxes');

    for (let i = 0; i < unicodeShapes.length; i++) {
        let id = 'shape' + i;

        let liEl = document.createElement('li');

        let checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('id', id);
        checkboxEl.oninput = function() {
            redrawWithNewSeed();
        };
        controls[id] = new CheckboxControl(id, checkboxEl);
        let value = valueWithSearchParam(id);
        if (value != null) controls[id].setValue(value);

        liEl.appendChild(checkboxEl);

        let labelEl = document.createElement('label');
        labelEl.setAttribute('for', id);

        labelEl.appendChild(document.createTextNode(unicodeShapes[i]));

        liEl.appendChild(labelEl);
        ulEl.appendChild(liEl);
    }

    let containerDiv = document.createElement('div');
    containerDiv.appendChild(ulEl);
    return containerDiv;
}

function setupForm() {
    makeForm(
        createShapeCheckboxControl(),
        makeFieldset('Farben',
            makeSelectColorMap(),
            makeSelectBlendMode([BLEND, DARKEST, DIFFERENCE, EXCLUSION, HARD_LIGHT, MULTIPLY]),
            makeSlider('numColors', 'Anzahl der Farben', 1, 12, 6),
            makeSlider('alpha', 'Transparenz (Alpha)', 30, 90, [80, 100]),
        ),
        makeSlider('numTiles', 'Anzahl der Kacheln pro Achse', 1, 16, 8),
        makeSlider('numObjects', 'Anzahl der Objekte', 20, 1000, 100, 20),
        makeSlider('strokeWeight', 'Strichstärke', 1, 25, [10, 20]),
        makeSlider('rotation', 'Maximale Rotation', 0, 270, [0, 90], 90),
        makeSlider('scaleFactor', 'Skalierung', 0.5, 1.5, [0.7, 1], 0.1),
    );

    let activeShapes = myShape.types.filter(i => controls['shape' + i].getValue());

    /* Activate a random set of shapes. Important: use Math.random(),
     * not p5's random() so you get the same image with the same seed
     * regardless of whether or not shape values were given in the query
     * string.
     */

    if (activeShapes.length === 0) {
        let randomShapes = [...myShape.types].sort(() => .5 - Math.random()).slice(0, 3);
        randomShapes.forEach(i => controls['shape' + i].setValue(true));
    }
}

function drawSketch() {
    rectMode(CENTER);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    blendMode(ctrl.blendMode);
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    let activeShapes = myShape.types.filter(i => ctrl['shape' + i]);
    let offset = int(width / ctrl.numTiles); // assume width == height

    for (let i = 0; i < ctrl.numObjects; i++) {
        let centerPoint = [
            (int(random(ctrl.numTiles)) + 0.5) * offset,
            (int(random(ctrl.numTiles)) + 0.5) * offset
        ];
        let [minRotation, maxRotation] = ctrl.rotation;
        new myShape()
            .setType(random(activeShapes))
            .setColor(random(palette))
            .setCenterPoint(centerPoint)
            .setSize(offset)
            .setStrokeWeight(randomIntRange(...ctrl.strokeWeight))
            .setAlpha(randomIntRange(...ctrl.alpha))
            .setScale(random(...ctrl.scaleFactor))
            .setRotation(int(random(minRotation / 90, maxRotation / 90 + 1)))
            .display();
    }
}

class myShape {

    static types = [...unicodeShapes.keys()]; // [0..n]

    constructor() {}

    setType(_type) {
        this.type = _type;
        return this;
    }

    setColor(_color) {
        this.color = _color;
        return this;
    }

    setCenterPoint(_p) {
        this.center = _p;
        return this;
    }

    /* 'size' is the total width (and height) of the square box in which
     * the shape is drawn. 'center' is the center of this box.
     */

    setSize(_size) {
        this.size = _size;
        return this;
    }

    setStrokeWeight(_strokeWeight) {
        this.strokeWeight = _strokeWeight;
        return this;
    }

    setAlpha(_alpha) {
        this.alpha = _alpha;
        return this;
    }

    setScale(_scale) {
        this.scale = _scale;
        return this;
    }

    setRotation(_rotation) {
        this.rotation = _rotation;
        return this;
    }

    display() {
        push();
        translate(...this.center);
        strokeWeight(this.strokeWeight);
        let c = color(this.color);
        c.setAlpha(this.alpha);
        stroke(c);
        scale(this.scale);
        noFill();
        rotate(radians(90) * this.rotation);

        if (this.type == 0) {
            /* circle */
            circle(0, 0, this.size);

        } else if (this.type == 1) {
            /* square */
            let sp = this.size;
            rect(0, 0, sp, sp);

        } else if (this.type == 2) {
            /* diamond */
            let sp = this.size / 2;
            beginShape();
            vertex(0, sp);
            vertex(sp, 0);
            vertex(0, -sp);
            vertex(-sp, 0);
            endShape(CLOSE);

        } else if (this.type == 3) {
            /* triangle */
            let sp = this.size / 2;
            triangle(-sp, -sp, -sp, sp, sp, 0);

        } else if (this.type == 4) {
            /* straight line */
            let sp = this.size / 2;
            line(-sp, 0, sp, 0);

        } else if (this.type == 5) {
            /* diagonal line */
            let sp = this.size / 2;
            line(-sp, -sp, sp, sp);

        } else if (this.type == 6) {
            /* plus */
            let sp = this.size / 2;
            line(0, -sp, 0, sp);
            line(-sp, 0, sp, 0);

        } else if (this.type == 7) {
            /* X */
            let sp = this.size / 2;
            line(-sp, -sp, sp, sp);
            line(sp, -sp, -sp, sp);

        }
        pop();
    }
}
