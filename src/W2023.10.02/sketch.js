'use strict';

/* Inspired by Vera Molnár, Journal Intimes 6 page 151-154.
 *
 * Each tile is a shape that has numPointsX * numPointsY points. All points
 * are drawn.
 *
 * Neighboring points have horizontal and vertical (but not diagonal)
 * connections. Only about half the connections are drawn.
 *
 * To build the connections, traverse the points from left to right and top
 * to bottom. Then you only have to check the potential neighbors to the
 * right and below.
 *
 * The tile has (0,0) in the upper left corner and (tile.width, tile.height) in
 * the lower right corner. Assume that there are 3 points horizontally, the
 * x-coordinates o the points will be tile.width * 0 / 2, tile.width * 1 / 2
 * and tile.width * 2 / 2. y-coordinates are calculated the same way, using
 * ratios and tile.height.
 *
 * Connections are stored in an array where each element has the coordinates of
 * the two endpoints of the line. That is, [ [x1, y1], [x2, y2] ].
 *
 * Because we only want to randomly draw only about half the connections, we
 * shuffle the array, then splice off the unwanted elements. Then we draw the
 * remaining lines.
 */

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln pro Achse', 3, 5, 4),
        makeSlider('numPointsX', 'Anzahl der horizontalen Punkte', 3, 5, 4),
        makeSlider('numPointsY', 'Anzahl der vertikalen Punkte', 3, 5, 4),
        makeSlider('strokeWeight', 'Strichstärke', 8, 20, 12),
        makeSlider('connectionsRatio', 'Prozent der Verbindungen', 30, 70, 50, 5),
        makeSlider('scale', 'Skalierung', 0.5, 0.8, 0.6, 0.05),
    );
}

function drawSketch() {
    noStroke();
    noFill();
    rectMode(CORNERS);
    background("white");
    stroke('black');
    strokeWeight(ctrl.strokeWeight);

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    scale(ctrl.scale);

    // makeGrid() translates to each tile's center, but here we want
    // (0, 0) to be in the tile's upper left corner.
    translate(...tile.upperLeft);

    let coords = (x, y) => {
        return [
            (x - 1) / (ctrl.numPointsX - 1) * tile.width,
            (y - 1) / (ctrl.numPointsY - 1) * tile.height
        ];
    };
    let connections = [];
    for (let y = 1; y <= ctrl.numPointsY; y++) {
        for (let x = 1; x <= ctrl.numPointsX; x++) {
            let c = coords(x, y);
            point(...c);

            // connection to the neighbor to the right?
            if (x < ctrl.numPointsX) {
                connections.push([c, coords(x + 1, y)]);
            }

            // connection to the neighbor below?
            if (y < ctrl.numPointsY) {
                connections.push([c, coords(x, y + 1)]);
            }
        }
        shuffle(connections, true);
        connections.splice(ctrl.numPointsX * ctrl.numPointsY * ctrl.connectionsRatio / 100);
        connections.forEach(el => line(...el[0], ...el[1]));
    }
}
