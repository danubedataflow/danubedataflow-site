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

    // scale down so the outer border is visible
    translate(width / 2, height / 2);
    scale(0.97);
    translate(-width / 2, -height / 2);

    background("black");
    makeGrid(ctrl.numTiles, width, ctrl.maxDepth);
    noLoop();
}

// make square grids
function makeGrid(numTiles, gridDim, maxDepth = 0, depth = 0) {
    let dim = gridDim / numTiles;
    for (let y = 1; y <= numTiles; y++) {
        for (let x = 1; x <= numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            if (depth < maxDepth && random() > 0.5) {
                // make a sub-grid that is as big as the tile
                makeGrid(int(random(3)) + 1, dim, maxDepth, depth + 1)
            } else {
                push();

                // Move to the tile center so that rotation and scaling happen
                // around that center.
                translate(dim / 2, dim / 2);

                scale(0.85);

                let fillStyle =
                    random([{
                            fillStyle: 'hachure',
                            fillWeight: 1,
                            hachureAngle: int(random(120, 150))
                        },
                        {
                            fillStyle: 'zigzag'
                        },
                        {
                            fillStyle: 'cross-hatch'
                        }
                    ]);
                let roughOptions = {
                    roughness: random(1, 1.5),
                    fill: random(palette),
                    stroke: 'white',
                    strokeWidth: randomIntRange(1, 2),
                    ...fillStyle,
                };

                let r = random();
                if (r < 0.33) {
                    roughCanvas.polygon(
                        [
                            [-dim / 2, dim / 2],
                            [dim / 2, dim / 2],
                            [0, -dim / 2]
                        ],
                        roughOptions);
                } else if (r < 0.66) {
                    roughCanvas.circle(0, 0, dim, roughOptions);
                } else {
                    roughCanvas.rectangle(-dim / 2, -dim / 2, dim, dim, roughOptions);
                }

                pop();
            }
            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
