'use strict';

function createImageCheckboxControl() {
    let ulEl = document.createElement('ul');
    ulEl.setAttribute('class', 'imageCheckboxes');

    for (let i = 0; i < 10; i++) {
        let id = 'shape' + i;

        let liEl = document.createElement('li');

        let checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('id', id);
        checkboxEl.oninput = controlsDidChange;
        controls[id] = new CheckboxControl(id, checkboxEl);
        let value = valueWithSearchParam(id);
        if (value != null) controls[id].setValue(value);

        liEl.appendChild(checkboxEl);

        let labelEl = document.createElement('label');
        labelEl.setAttribute('for', id);

        let imgEl = document.createElement('img');
        imgEl.setAttribute('src', 'images/' + id + '.png');
        labelEl.appendChild(imgEl);

        liEl.appendChild(labelEl);
        ulEl.appendChild(liEl);
    }

    let containerDiv = document.createElement('div');
    containerDiv.appendChild(ulEl);
    return containerDiv;
}

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        createImageCheckboxControl(),
        makeSelectColorMap(),
        makeSelectBlendMode(),
        makeSlider('numColors', 'Number of colors', 1, 12, 6),
        makeSlider('numTiles', 'Number of tiles', 1, 16, 8),
        makeSlider('numObjects', 'Number of objects', 20, 1000, 100, 20),
        makeSlider('strokeWeight', 'Stroke weight', 1, 25, [10, 20]),
        makeSlider('rotation', 'Maximum rotation', 0, 270, [0, 90], 90),
    );

    // activate a random set of shapes

    let activeShapes = myShape.types.filter(i => controls['shape' + i].getValue());
    if (activeShapes.length === 0) {
        let randomShapes = [...myShape.types].sort(() => .5 - Math.random()).slice(0, 3);
        randomShapes.forEach(i => controls['shape' + i].setValue(true));
    }
    noLoop();
}

function draw() {
    readControls();
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
            .setRotation(int(random(minRotation / 90, maxRotation / 90 + 1)))
            .display();
    }
}

class myShape {

    static types = [...Array(10).keys()]; // [0..9]

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

    setRotation(_rotation) {
        this.rotation = _rotation;
        return this;
    }

    display() {
        push();
        translate(...this.center);
        strokeWeight(this.strokeWeight);
        stroke(this.color);
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
            /* small square */
            let sp = this.size / 2;
            rect(0, 0, sp, sp);

        } else if (this.type == 3) {
            /* diamond */
            let sp = this.size / 2;
            beginShape();
            vertex(0, sp);
            vertex(sp, 0);
            vertex(0, -sp);
            vertex(-sp, 0);
            endShape(CLOSE);

        } else if (this.type == 4) {
            /* triangle */
            let sp = this.size / 2;
            triangle(-sp, -sp, -sp, sp, sp, 0);

        } else if (this.type == 5) {

            /* hollow cross */
            let sp3 = this.size / 3;
            let sp6 = this.size / 6;

            beginShape();

            // upper left part
            vertex(-(sp6 + sp3), -sp6);
            vertex(-sp6, -sp6);
            vertex(-sp6, -(sp6 + sp3));

            // upper right part
            vertex(sp6, -(sp6 + sp3));
            vertex(sp6, -sp6);
            vertex((sp6 + sp3), -sp6);

            // lower right part
            vertex((sp6 + sp3), sp6);
            vertex(sp6, sp6);
            vertex(sp6, (sp6 + sp3));

            // lower left part
            vertex(-sp6, (sp6 + sp3));
            vertex(-sp6, sp6);
            vertex(-(sp6 + sp3), sp6);

            endShape(CLOSE);

        } else if (this.type == 6) {
            /* straight line */
            let sp = this.size / 2;
            line(-sp, 0, sp, 0);

        } else if (this.type == 7) {
            /* diagonal line */
            let sp = this.size / 2;
            line(-sp, -sp, sp, sp);

        } else if (this.type == 8) {
            /* plus */
            let sp = this.size / 2;
            line(0, -sp, 0, sp);
            line(-sp, 0, sp, 0);

        } else if (this.type == 9) {
            /* X */
            let sp = this.size / 2;
            line(-sp, -sp, sp, sp);
            line(sp, -sp, -sp, sp);

        }
        pop();
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (handleStandardKeys()) return;
    // if (key == 'c') createCheckboxImages();
}

/* For development purposes only. This function creates the images that
 * are used in the image checkboxes. See keyPressed().
 */

function createCheckboxImages() {
    let imageSize = 100;
    resizeCanvas(imageSize, imageSize);
    myShape.types.forEach(i => {
        clear(); // transparent background
        let centerPoint = [ imageSize / 2, imageSize / 2 ];

        new myShape()
            .setType(i)
            .setColor('black')
            .setCenterPoint(centerPoint)
            .setSize(imageSize - 20)
            .setStrokeWeight(5)
            .setRotation(0)
            .display();
        saveCanvas('shape' + i + '.png');
    });
}

