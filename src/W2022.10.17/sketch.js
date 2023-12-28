'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

let roughCanvas, palette;

function setupForm() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'XXX', 1, 12, 6),
        ),
        makeSlider('numTiles', 'XXX', 2, 10, 4),
        makeSlider('maxDepth', 'Maximale Tiefe', 0, 4, 2),
    );
}

function drawSketch() {
    roughCanvas = rough.canvas(canvas.elt);
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    padSketch();
    background('black');
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        numSubdivisions: function(depth) {
            if (depth >= ctrl.maxDepth) return 0;
            return (random() > 0.5) * int(random(3)) + 1;
        },
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
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
                tile.upperLeft, tile.upperRight, tile.lowerMiddle
            ],
            roughOptions);
    } else if (r < 0.66) {
        roughCanvas.circle(0, 0, min(tile.width, tile.height), roughOptions);
    } else {
        roughCanvas.rectangle(...tile.upperLeft, tile.width, tile.height, roughOptions);
    }
}
