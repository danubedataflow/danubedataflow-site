'use strict';

// also show the canvas size on the web page
function getCanvasDimension() {
    let headerHeight = 100 * pixelDensity();
    let dim = min(windowWidth, windowHeight - headerHeight);
    document.getElementById('canvasSize').innerText = `${dim} x ${dim}`;
    return [dim, dim];
}

function saveCanvasAsPNG() {
    let name = location.href.split('/').slice(-3, -1).join("--");
    saveCanvas(decodeURI(name) + '.png');
}

// returns 1 if handled, 0 if not
function handleStandardKeys() {
    if (key == 's') {
        saveCanvasAsPNG();
        return 1;
    } else if (key == 'r') {
        redraw();
        return 1;
    } else if (key == 'p') {
        setControlsRandomly();
        return 1;
    }
    return 0;
}

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

function randomIntRange(lowerBound, upperBound) {
    return int(random(lowerBound, upperBound + 1));
}
