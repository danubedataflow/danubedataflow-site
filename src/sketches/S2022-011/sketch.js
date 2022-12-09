'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

makeForm(
    makeSlider('numTiles', 'Number of tiles', 2, 10, 4),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 2),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();
    colorMode(HSB, 360, 100, 100, 100);
    angleMode(DEGREES);
    rectMode(CENTER);
    noStroke();

    let grid = makeGrid(ctrl.numTiles, width / 2, height / 2, width, ctrl.maxDepth);

    /* Draw tiles in random order so if sizeFactor > 1 they overlap each other
     * randomly. If we just used `grid.draw()`, the tiles would be drawn from
     * the top left corner to the bottom right corner.
     */
    background("white");
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
        if (depth < maxDepth && random() > 0.5) {
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
            // background rectangle for each tile
            let background = new Rectangle;
            background.fillColor = color(random(255), random(100));
            background.strokeWeight = 1;
            tile.contents.push(background);

            let shape = random([
                new Triangle(),
                new Circle(),
                new Cross(),
                new Rectangle(),
            ]);
            shape.fillColor = color(random(255), 100 + random(155));
            shape.rotation = 90 * int(random(4));
            shape.flipHorizontally = random() > 0.5 ? true : false;
            shape.flipVertically = random() > 0.5 ? true : false;
            shape.sizeFactor = (30 + random(70)) / 100;
            shape.strokeWeight = 1;
            /* Using this noise offset each shape starts the perlin noise
             * at a different point so all shapes can animate their
             * properties differently.
             */
            shape.config.noiseOffset = random() * 999;
            tile.contents.push(shape);
        }
    });
    return grid;
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
