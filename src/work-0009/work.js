import {
    Work
} from '/js/basework.js';
import {
    Point
} from '/js/point.js';
export class Work0009 extends Work {
    getControls() {
        return [
            this.makeSelectColorMap(),
            this.makeSlider('modulus', 'Modulus: {0}', 10, 300, 100),
            this.makeSlider('timesTable', 'Mulitply each point value by: {0}', 2, 100, 10, 0.2),
        ];
    }
    drawWork() {
        this.clearCanvas('#cccccc');
        this.ctx.globalCompositeOperation = 'exclusion';
        this.ctx.fillStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.width, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        const radius = this.width / 2;
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.modulus);
        for (let i = 0; i < this.ctrl.modulus; i++) {
            // cycle through all colors in the palette; wrap around
            const colorIndex = (i + palette.length) % palette.length;
            this.ctx.strokeStyle = palette[colorIndex];
            let j = i * this.ctrl.timesTable;
            this.linePath(new Point(Math.sin(this.angle(i, this.ctrl.modulus)) * radius, Math.cos(this.angle(i, this.ctrl.modulus)) * radius),
                new Point(Math.sin(this.angle(j, this.ctrl.modulus)) * radius, Math.cos(this.angle(j, this.ctrl.modulus)) * radius));
            this.ctx.stroke();
        }
    }
    angle(n, modulus) {
        return n * Math.PI * 2 / modulus;
    }
    description = `Points along a circle correspond to the modulus. For each point, its value is multiplied by the given number, then a line is drawn from the point to the point corresponding to the the modulus remainder. Based on the Mathologer video <a href="https://www.youtube.com/watch?v=qhbuKbxJsk8">Times Tables, Mandelbrot and the Heart of Mathematics</a>. The modulus is the number of points on the circle.`;
    createdDate = '2022-10-06';
}
