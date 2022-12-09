'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

makeForm(
    makeSelectColorMap(),
    makeSlider('numColors', 'Number of colors', 1, 12, 6),
    makeSlider('numTiles', 'Number of tiles', 2, 10, 4),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 2),
);

let canvas, roughCanvas, palette;

function setup() {
    canvas = createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();

    roughCanvas = rough.canvas(canvas.elt);
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    angleMode(DEGREES);
    rectMode(CENTER);

    let grid = makeGrid(ctrl.numTiles, width / 2, height / 2, width, ctrl.maxDepth);

    /* Draw tiles in random order so if sizeFactor > 1 they overlap each other
     * randomly. If we just used `grid.draw()`, the tiles would be drawn from
     * the top left corner to the bottom right corner.
     */
    background("black");
    grid
        .getTiles()
        .shuffle()
        .forEach((t) => t.draw());
    noLoop();
}

// make square grids
function makeGrid(numTiles, centerX, centerY, dim, maxDepth = 0, depth = 0) {
    let grid = new Grid();
    grid.numRows = numTiles;
    grid.numCols = numTiles;
    grid.centerX = centerX;
    grid.centerY = centerY;
    grid.gridWidth = dim;
    grid.gridHeight = dim;
    grid.initTiles();
    grid.iterate((tile) => {
        if (depth < maxDepth && random() > 0.6) {
            // make a sub-grid that is as big as the tile
            tile.contents.push(
                makeGrid(
                    int(random(3)) + 1,
                    tile.centerX,
                    tile.centerY,
                    tile.tileWidth,
                    maxDepth,
                    depth + 1
                )
            );
        } else {

            let shape = random([
                new RoughRectangle(),
                new RoughCircle(),
                new RoughTriangle(),
            ]);
            shape.roughCanvas = roughCanvas;
            shape.sizeFactor = 0.85;
            shape.fillColor = random(palette);
            shape.fillStyle =
                random([{
                        fillStyle: 'hachure',
                        hachureAngle: int(random(120, 150))
                    },
                    {
                        fillStyle: 'zigzag'
                    },
                    {
                        fillStyle: 'cross-hatch'
                    }
                ]);
            shape.roughness = random(1, 1.5);
            shape.strokeColor = 'white';
            shape.strokeWeight = int(random(1, 3));

            tile.contents.push(shape);
        }
    });
    return grid;
}

class RoughShape extends Shape {
    roughness = 1;
    fillStyle = {
        fillStyle: 'hachure',
        fillWeight: 1,
        hachureAngle: 135
    };

    getRoughOptions() {
        return {
            roughness: this.roughness,
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWeight,
            ...this.fillStyle,
        };
    }
}

class RoughRectangle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas.rectangle(-w / 2, -h / 2, w, h, this.getRoughOptions());
    }
}

class RoughCircle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas.circle(0, 0, min(w, h), this.getRoughOptions());
    }
}

class RoughTriangle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas.polygon(
            [
                [-w / 2, h / 2],
                [w / 2, h / 2],
                [0, -h / 2]
            ],
            this.getRoughOptions());
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
