import {
    Work
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorHSLA
} from '/js/colors.js';
class Work0015 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numHorizontalLines', 'Number of horizonal lines: {0}', 1, 10, 5),
            this.makeSlider('numVerticalLines', 'Number of vertical lines: {0}', 1, 10, 5),
            this.makeSlider('lineWidthRangeRelative', 'Line this.width range: {0}% to {1}% of the canvas', 1, 20, [9, 13]),
            this.makeFieldset('Colors',
                this.makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
                this.makeSlider('saturationRange', 'Saturation range: {0} to {1}', 40, 100, [60, 80]),
                this.makeSlider('lightnessRange', 'Ligntness range: {0} to {1}', 40, 100, [60, 80]),
                this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 1, 100, [20, 80]),
            ),
        );
    }
    setRandomFillColor() {
        this.ctx.fillStyle = colorHSLA(
            this.ctrl.colorAngle,
            randomIntRange(...this.ctrl.saturationRange),
            randomIntRange(...this.ctrl.lightnessRange),
            randomIntRange(...this.ctrl.alphaRange) / 100
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.fillStyle = 'black';
        for (let i = 0; i <= this.ctrl.numHorizontalLines; i++) {
            let x1 = randomIntUpTo(this.width);
            let w = randomIntRange(...this.ctrl.lineWidthRangeRelative) * this.width / 100;
            this.setRandomFillColor();
            this.ctx.fillRect(x1, 0, w, this.height);
        }
        for (let i = 0; i <= this.ctrl.numVerticalLines; i++) {
            let y1 = randomIntUpTo(this.width);
            let h = randomIntRange(...this.ctrl.lineWidthRangeRelative) * this.height / 100;
            this.setRandomFillColor();
            this.ctx.fillRect(0, y1, this.width, h);
        }
    }
    description = `Horizontal and vertical lines with random positions and random colors.`;
    createdDate = '2022-11-19';
}
new Work0015().run();