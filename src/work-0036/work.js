import {
    Work
} from '/js/ui.js';
import {
    random
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
import {
    Point
} from '/js/point.js';
class Work0036 extends Work {
    palette;
    setupControls() {
        this.makeForm(
            this.makeSlider('subdivisionDepth', 'Subdivision recursion depth: {0} to {1} levels', 2, 6, [2, 5]),
            this.makeSlider('subdivisionChance', '{0}% probability that subdividing continues at each level', 20, 80, 60),
            this.makeSlider('chanceFill', '{0}% probability that a terminal square is filled', 20, 80, 50),
            this.makeCheckbox('hasBorder', 'Square border: '),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 10, 6),
            ),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        // draw outer border if enabled
        if (this.ctrl.hasBorder) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(0, 0, this.width, this.height);
        }
        this.drawSquare(new Point(0, 0), this.width, 0);
    }
    drawSquare(upperLeft, squareSize, currentDepth) {
        let [minDepth, maxDepth] = this.ctrl.subdivisionDepth;
        // If we haven't reached the minimum currentDepth, we have to subdividide.
        // After that, up to the maximum currentDepth, it depends on chance.
        const shouldSubdivide =
            currentDepth < minDepth || (currentDepth < maxDepth && random() < this.ctrl.subdivisionChance / 100);
        if (shouldSubdivide) {
            const half = squareSize / 2;
            this.drawSquare(upperLeft, half, currentDepth + 1);
            this.drawSquare(upperLeft.moveX(half), half, currentDepth + 1);
            this.drawSquare(upperLeft.moveY(half), half, currentDepth + 1);
            this.drawSquare(upperLeft.move(half, half), half, currentDepth + 1);
        } else {
            // it's a terminal square
            if (random() < this.ctrl.chanceFill / 100) {
                this.ctx.fillStyle = randomElement(this.palette);
                this.ctx.fillRect(...upperLeft.asArray(), squareSize, squareSize);
            }
            if (this.ctrl.hasBorder) {
                this.ctx.strokeStyle = 'black';
                this.ctx.strokeRect(...upperLeft.asArray(), squareSize, squareSize);
            }
        }
    }
    description = `The canvas is subdivided into four squares. Each of these squares is recursively subdivided up to a random currentDepth. Each square has an optional border. Each terminal square has an optional fill.`;
    createdDate = '2026-01-19';
}
new Work0036().run();