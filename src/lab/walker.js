function setup() {
    createCanvas(300, 300);
    noLoop();
}

function draw() {
    background('white');
    angleMode(DEGREES);
    stroke('black');
    noFill();

    drawWalkers();

    // rotate by 90 degrees along the center
    translate(width / 2, height / 2);
    rotate(90);
    translate(-width / 2, -height / 2);

    drawWalkers();
}

function drawWalkers() {
    let lineGap = 50; // of the initial points between walkers
    let maxMovement = 10; // for each step of each walker
    for (let startY = 0; startY <= height; startY += lineGap) {
        let y = startY;
        fill(color(random(255), random(255), random(255), 50));

        /* Make a shape that borders the left, top and right side; the bottom
         * is determined by the walker. We use a random semitransparent fill
         * for each shape so each intersecting shape of adjacent horizontal and
         * vertical walkers is filled by a color that is related to its
         * neighbors.
         */
        beginShape();
        vertex(0, 0);
        for (let x = 0; x <= width; x += maxMovement) {
            vertex(x, y);
            y = constrain(y + random(-maxMovement, maxMovement), 0, height);
        }
        vertex(width, 0);
        endShape(CLOSE);
    }

    // draw a border
    noFill();
    rect(0, 0, width, height);
}
