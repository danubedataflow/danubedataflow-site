import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
class Work0030 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 70, 50),
            this.makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
            this.makeSlider('lineScale', 'Line scale: {0}', 0.5, 1.5, 1, 0.1),
            this.makeFieldset('Curves',
                this.makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
                this.makeSlider('curveScale', 'Curve scale: {0}', 0.5, 1, 0.6, 0.05),
            ),
        );
    }
    drawWork() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        let path = this.randomPath(this.ctrl.numCurves, this.ctrl.curveScale);
        const lineLength = this.ctrl.lineScale * this.width / this.ctrl.numTiles;
        let d = window.devicePixelRatio; // no idea why this is necessary
        this.gridCenters(this.ctrl.numTiles)
            .filter(p => !this.ctx.isPointInPath(path, p[0] * d, p[1] * d))
            .forEach(p => {
                // Draw a line at a random angle around the center of p.
                this.ctx.save();
                this.ctx.translate(...p);
                this.ctx.rotate(2 * Math.PI * MathUtils.randomIntUpTo(this.ctrl.angleStep) / this.ctrl.angleStep);
                this.ctx.beginPath();
                this.ctx.moveTo(-lineLength / 2, 0);
                this.ctx.lineTo(lineLength / 2, 0);
                this.ctx.stroke();
                this.ctx.restore();
            });
    }
    gridCenters(num) {
        let p = [];
        for (let y = 0; y < num; y++) {
            for (let x = 0; x < num; x++) {
                p.push([(x + 0.5) * this.width / num, (y + 0.5) * this.height / num]);
            }
        }
        return p;
    }
    randomPath(n, curveScale) {
        // this offset applies to the whole path
        let pathOffsetX = MathUtils.randomIntPlusMinus(this.width / 2);
        let pathOffsetY = MathUtils.randomIntPlusMinus(this.height / 2);
        let randomPoint = () => {
            return [
                MathUtils.randomIntUpTo(this.width * curveScale) + pathOffsetX,
                MathUtils.randomIntUpTo(this.height * curveScale) + pathOffsetY
            ]
        };
        /*
         * Create a path of possibly overlapping bezier curves. Each curve extends
         * the current path and has two control points and an end point. Because of
         * the overlaps and isPointInPath()'s algorithms, this creates the effect of
         * islands within the greater path.
         */
        let path = new Path2D();
        for (let i = 0; i < n; i++) {
            path.bezierCurveTo(...randomPoint(), ...randomPoint(), ...randomPoint());
        }
        path.closePath();
        return path;
    }
    description = `Grid of lines with random rotation, except for those lines which would lie in a random path. Homage to "Interruptions"  by Vera Molnár, 1968-1969.`;
    createdDate = '2024-03-03';
}
new Work0030().run();