'use strict';

function getPointsForPolygon(sides, diameter, rotation) {
    // the polygon center is (0, 0)
    let points = [];
    for (let i = 0; i < sides + 1; i++) {
        let angle = 2 * Math.PI / sides * i + 2 * Math.PI * rotation / 360;
        points.push([
            Math.sin(angle) * diameter / 2,
            Math.cos(angle) * diameter / 2
        ]);
    }
    return points;
}

function getRandomPointOnCircle(radius) {
    let angle = random() * 2 * Math.PI;
    return ([
        sin(angle) * radius,
        cos(angle) * radius
    ]);
}

// ==================================================================

/* See https://math.stackexchange.com/a/4128516
 *
 * x(n) is the sum of sin(term) for 1 <= k <= n.
 *
 * y(n) is the sum of cos(term) for 1 <= k <= n.
 *
 * Since we are iterating, we just need to add the latest term to get the new
 * values.
 */
function iterateSquareSpiral(max, callback) {
    let x = 0,
        y = 0;
    callback(x, y, 0);
    for (let k = 1; k < max; k++) {
        let term = PI / 2 * Math.floor(sqrt(4 * k - 3));
        x += sin(term);
        y += cos(term);
        callback(x, y, k);
    }
}

// ==================================================================

class Tile {
    /* `contents` is an array of objects that have a draw() method. They can be
     * Shape objects or nested Grid objects. So the tile background can be a
     * separate shape. Shapes are drawn on top of each other. Each shape has
     * its own rotation, sizeFactor etc.
     */

    contents = [];

    draw() {
        this.contents.forEach((c) =>
            c.draw(
                this.centerX(),
                this.centerY(),
                this.tileWidth(),
                this.tileHeight()
            )
        );
    }
}

createAccessors(Tile, ["centerX", "centerY", "tileWidth", "tileHeight"]);

class Grid {
    tiles = [];

    // initTiles() needs to be called right after creating a Grid object.
    initTiles() {
        let numRows = this.numRows();
        let numCols = this.numCols();
        let gridWidth = this.gridWidth();
        let gridHeight = this.gridHeight();

        let tileWidth = gridWidth / numRows;
        let tileHeight = gridHeight / numCols;

        let leftEdge = this.centerX() - gridWidth / 2;
        let topEdge = this.centerY() - gridHeight / 2;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let index = row * numCols + col;
                let tileCenterX = leftEdge + (row + 0.5) * tileWidth;
                let tileCenterY = topEdge + (col + 0.5) * tileHeight;
                this.tiles[index] = new Tile()
                    .centerX(tileCenterX)
                    .centerY(tileCenterY)
                    .tileWidth(tileWidth)
                    .tileHeight(tileHeight);
            }
        }
        return this; // for chaining
    }

    getTileAt(row, col) {
        let index = row * this.numCols() + col;
        return this.tiles[index];
    }

    getTiles() {
        return this.tiles;
    }

    draw() {
        this.tiles.forEach((tile) => tile.draw());
        return this; // for chaining
    }

    iterate(callback) {
        this.tiles.forEach((tile) => callback(tile));
        return this; // for chaining
    }
}

createAccessors(Grid, [
    "numRows",
    "numCols",
    "centerX",
    "centerY",
    "gridWidth",
    "gridHeight",
]);

// Helper class for drawing symmetrical shapes.
class Vertices {
    _vertices = [];

    constructor(vertices) {
        this._vertices = vertices;
    }

    reversed() {
        // reverse() operates in-place, so make a shallow copy
        return new Vertices([...this._vertices].reverse());
    }

    mirroredHorizontally() {
        return new Vertices(this._vertices.map((v) => [-v[0], v[1]]));
    }

    mirroredVertically() {
        return new Vertices(this._vertices.map((v) => [v[0], -v[1]]));
    }

    draw() {
        this._vertices.forEach((v) => vertex(v[0], v[1]));
        return this; // for chaining
    }
}

class Shape {
    /* The color, rotation, scale and other shape parameters are set before
     * drawing so the shape looks the same each time it is drawn. `config` is a
     * container for arbitrary settings. Access it directly, without an
     * accessor.
     */

    _fillColor = "black";
    _rotation = 0;
    _flipHorizontally = false;
    _flipVertically = false;
    _sizeFactor = 1;
    _strokeColor = "black";
    _strokeWeight = 0;
    config = {};

    draw(cx, cy, w, h) {
        push();
        translate(cx, cy);

        // Handle transforms
        let xScale = this.flipHorizontally() ? -1 : 1;
        let yScale = this.flipVertically() ? -1 : 1;
        let sizeFactor = this.sizeFactor();
        xScale *= sizeFactor;
        yScale *= sizeFactor;
        scale(xScale, yScale);

        rotate(this.rotation());
        stroke(this.strokeColor());
        strokeWeight(this.strokeWeight());
        fill(this.fillColor());

        // Now that everything is in place, draw the actual shape around (0, 0).
        this.drawShape(w, h);
        pop();
    }
}

createAccessors(Shape, [
    "fillColor",
    "rotation",
    "flipHorizontally",
    "flipVertically",
    "sizeFactor",
    "strokeColor",
    "strokeWeight",
]);

class Circle extends Shape {
    drawShape(w, h) {
        circle(0, 0, min(w, h));
    }
}

class Arc extends Shape {
    _startAngle = 0;
    _endAngle = 90;

    drawShape(w, h) {
        arc(-w / 2, -h / 2, w * 2, h * 2, this.startAngle(), this.endAngle());
    }
}
createAccessors(Arc, ["startAngle", "endAngle"]);

class Triangle extends Shape {
    drawShape(w, h) {
        triangle(-w / 2, -h / 2, w / 2, -h / 2, 0, h / 2);
    }
}

class Arrow extends Shape {
    drawShape(w, h) {
        beginShape();
        // upper part
        let vertices = new Vertices([
            [-w / 2, -h / 4],
            [0, -h / 4],
            [0, -h / 2],
        ]).draw();
        vertex(w / 2, 0);
        vertices.reversed().mirroredVertically().draw();

        endShape(CLOSE);
    }
}
class Cross extends Shape {
    drawShape(w, h) {
        /* FIXME: use height as well */
        let w6 = w / 6;
        let w36 = w / 3 + w6;

        beginShape();
        // upper left
        let vertices = new Vertices([
            [-w36, -w6],
            [-w6, -w6],
            [-w6, -w36],
        ]).draw();

        // upper right
        vertices.reversed().mirroredHorizontally().draw();

        // lower right
        vertices.mirroredVertically().mirroredHorizontally().draw();

        // lower left
        vertices.reversed().mirroredVertically().draw();

        endShape(CLOSE);
    }
}

class Rectangle extends Shape {
    drawShape(w, h) {
        rect(0, 0, w, h);
    }
}

// ==================================================================

function simpleGrid(config) {
    let {
        callback,
        numTiles,
        w = width,
        h = height,
        margin = 0
    } = config;
    let dim = (w - 2 * margin) / numTiles;

    for (let y = 1; y <= numTiles; y++) {
        let centerY = map(y, 1, numTiles, dim / 2 + margin, h - dim / 2 - margin);
        for (let x = 1; x <= numTiles; x++) {
            let centerX = map(x, 1, numTiles, dim / 2 + margin, w - dim / 2 - margin);
            push();
            translate(centerX, centerY);
            callback({
                dim: dim,
                x: x,
                y: y
            });
            pop();
        }
    }
}
