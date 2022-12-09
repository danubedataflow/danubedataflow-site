'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

let grid;

makeForm(
    makeSlider('numTiles', 'Number of tiles', 2, 10, 4),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 2),
);

function initSketch() {
    colorMode(HSB, 360, 100, 100, 100);
    angleMode(DEGREES);
    rectMode(CENTER);
    noStroke();

    grid = makeGrid(ctrl.numTiles, width / 2, height / 2, width, ctrl.maxDepth);
}

function draw() {
    readControls();
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
    return new Grid()
        .numRows(numTiles)
        .numCols(numTiles)
        .centerX(centerX)
        .centerY(centerY)
        .gridWidth(dim)
        .gridHeight(dim)
        .initTiles()
        .iterate((tile) => {
            if (depth < maxDepth && random() > 0.5) {
                // make a sub-grid that is as big as the tile
                tile.contents.push(
                    makeGrid(
                        int(random(3)) + 1,
                        tile.centerX(),
                        tile.centerY(),
                        tile.tileWidth(),
                        maxDepth,
                        depth + 1
                    )
                );
            } else {
                // background rectangle for each tile
                tile.contents.push(
                    new Rectangle()
                    .fillColor(color(random(255), random(100)))
                    .strokeWeight(1)
                );

                let maker = random([
                    _ => new Triangle(),
                    _ => new Circle(),
                    _ => new Cross(),
                    _ => new Rectangle(),
                ]);
                let shape = maker()
                    .fillColor(color(random(255), 100 + random(155)))
                    .rotation(90 * int(random(4)))
                    .flipHorizontally(random() > 0.5 ? true : false)
                    .flipVertically(random() > 0.5 ? true : false)
                    .sizeFactor((30 + random(70)) / 100)
                    .strokeWeight(1);
                /* Using this noise offset each shape starts the perlin noise
                 * at a different point so all shapes can animate their
                 * properties differently.
                 */
                shape.config.noiseOffset = random() * 999;
                tile.contents.push(shape);
            }
        });
}
