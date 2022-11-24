'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

const config = new Config()
    .title('S2022-15')
    .maxIterations(1);

let roughCanvas, grid, palette;

makeForm(
    makeSelectColorMap(),
    makeSlider('numColors', 'Number of colors', 1, 12, 6),
    makeSlider('numTiles', 'Number of tiles', 2, 10, 4),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 2),
);

function initSketch() {
    if (roughCanvas === undefined) {
        roughCanvas = rough.canvas(canvas.elt);
    }

    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    angleMode(DEGREES);
    rectMode(CENTER);

    grid = makeGrid(ctrl.numTiles, width / 2, height / 2, width, ctrl.maxDepth);
}

function drawSketch() {
    /* Draw tiles in random order so if sizeFactor > 1 they overlap each other
     * randomly. If we just used `grid.draw()`, the tiles would be drawn from
     * the top left corner to the bottom right corner.
     */
    background("black");
    grid
        .getTiles()
        .shuffle()
        .forEach((t) => t.draw());
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
            if (depth < maxDepth && random() > 0.6) {
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

                let shapeMaker = random([
                    _ => new RoughRectangle(),
                    _ => new RoughCircle(),
                    _ => new RoughTriangle(),
                ]);
                let fillStyle = random([{
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
                let shape = shapeMaker()
                    .roughCanvas(roughCanvas)
                    .sizeFactor(0.85)
                    .fillColor(random(palette))
                    .fillStyle(fillStyle)
                    .roughness(random(1, 1.5))
                    .strokeColor('white')
                    .strokeWeight(int(random(1, 3)));
                tile.contents.push(shape);
            }
        });
}

class RoughShape extends Shape {
    _roughness = 1;
    _fillStyle = {
        fillStyle: 'hachure',
        fillWeight: 1,
        hachureAngle: 135
    };

    getRoughOptions() {
        return {
            roughness: this.roughness(),
            fill: this.fillColor(),
            stroke: this.strokeColor(),
            strokeWidth: this.strokeWeight(),
            ...this.fillStyle(),
        };
    }
}

createAccessors(RoughShape, [
    "roughCanvas",
    "roughness",
    "fillStyle"
]);

class RoughRectangle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas().rectangle(-w / 2, -h / 2, w, h, this.getRoughOptions());
    }
}

class RoughCircle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas().circle(0, 0, min(w, h), this.getRoughOptions());
    }
}

class RoughTriangle extends RoughShape {
    drawShape(w, h) {
        this.roughCanvas().polygon(
            [
                [-w / 2, h / 2],
                [w / 2, h / 2],
                [0, -h / 2]
            ],
            this.getRoughOptions());
    }
}
