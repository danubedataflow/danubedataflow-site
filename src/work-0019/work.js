import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0019 extends Work {
    setupControls() {
        this.makeForm(
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 16, 8),
                this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 20, 35, [25, 30]),
            ),
            this.makeSlider('numGrids', 'Number of grids: {0}', 2, 10, 4),
            this.makeSlider('segmentSizeRange', 'Segment size range: {0}% to {1}% of the width', 10, 30, [20, 25]),
            this.makeSlider('lineWidth', 'Line this.width: {0}', 1, 4, 1),
        );
    }
    drawWork() {
        this.clearCanvas('black');
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.ctrl.lineWidth;
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        for (let i = 0; i < this.ctrl.numGrids; i++) {
            this.drawGrid(this.width, palette, MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100);
        }
    }
    drawGrid(width, palette, alpha) {
        let drawType = ArrayUtils.randomElement(['plain', 'diagonal']);
        let vsegments = [];
        let avgSize = width * MathUtils.randomIntRange(...this.ctrl.segmentSizeRange) / 100;
        let [minSize, maxSize] = [avgSize * 0.75, avgSize * 1.25];
        for (let y = 0; y < width; y += MathUtils.randomIntRange(minSize, maxSize)) {
            vsegments.push(y);
        }
        vsegments.push(width);
        ArrayUtils.pairwise(vsegments, (vcurrent, vnext) => {
            let hsegments = [];
            for (let x = 0; x < width - (minSize + maxSize) / 2; x += MathUtils.randomIntRange(minSize, maxSize)) {
                hsegments.push(x);
            }
            hsegments.push(width);
            ArrayUtils.pairwise(hsegments, (hcurrent, hnext) => {
                if (drawType == 'plain') {
                    this.ctx.fillStyle = ColorUtils.colorRGBA(...chroma(ArrayUtils.randomElement(palette)).rgb(), alpha);
                    this.ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                    this.ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                } else if ((drawType == 'diagonal')) {
                    let c1, c2;
                    c1 = ArrayUtils.randomElement(palette);
                    do {
                        c2 = ArrayUtils.randomElement(palette);
                    } while (c1 == c2);
                    this.ctx.fillStyle = ColorUtils.colorRGBA(...chroma(c1).rgb(), alpha);
                    this.ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                    this.ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                    this.ctx.fillStyle = ColorUtils.colorRGBA(...chroma(c2).rgb(), alpha);
                    if (MathUtils.random() < 0.5) {
                        // draw a triangle
                        this.ctx.beginPath();
                        this.ctx.moveTo(hcurrent, vcurrent);
                        this.ctx.lineTo(hnext, vcurrent);
                        this.ctx.lineTo(hnext, vnext);
                        this.ctx.closePath();
                        this.ctx.fill();
                        this.ctx.stroke();
                    } else {
                        // draw a triangle
                        this.ctx.beginPath();
                        this.ctx.moveTo(hnext, vcurrent);
                        this.ctx.lineTo(hnext, vnext);
                        this.ctx.lineTo(hcurrent, vnext);
                        this.ctx.closePath();
                        this.ctx.fill();
                        this.ctx.stroke();
                    }
                }
            });
        });
    }
    description = `Multiple irregular grids layered on top of each other. Each tile is colored and can randomly have a colored triangle layered on top`;
    createdDate = '2022-12-13';
}
