import {
    Work
} from '/js/ui.js';
import {
    random,
    randomIntUpTo
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
class Work0018 extends Work {
    palette;
    color1;
    color2;
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
            this.makeSlider('diagonalOrientationChance', "Probability of the diagonal's orientation: {0}%", 0, 100, 50),
            this.makeSelect('colorStrategy', 'Color strategy: ', [
                this.makeOption('random', 'Random'),
                this.makeOption('adjacent', 'Adjacent'),
            ]),
        );
    }
    drawWork() {
        this.palette = ['white', '#777777', 'black'];
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                this.ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
                this.chooseColors(this.ctrl.colorStrategy);
                if (randomIntUpTo(100) < this.ctrl.diagonalOrientationChance) {
                    // upper left to lower right
                    this.ctx.fillStyle = this.color1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(tileDim, tileDim);
                    this.ctx.lineTo(0, tileDim);
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.fillStyle = this.color2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(tileDim, tileDim);
                    this.ctx.lineTo(tileDim, 0);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else {
                    // upper right to lower left
                    this.ctx.fillStyle = this.color1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(tileDim, 0);
                    this.ctx.lineTo(0, tileDim);
                    this.ctx.lineTo(0, 0);
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.fillStyle = this.color2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(tileDim, 0);
                    this.ctx.lineTo(0, tileDim);
                    this.ctx.lineTo(tileDim, tileDim);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                this.color1 = this.color2;
                this.ctx.restore();
            }
        }
    }
    chooseColors(colorStrategy) {
        if (colorStrategy === 'random') {
            // choose two different random colors
            this.color1 = randomElement(this.palette);
            do {
                this.color2 = randomElement(this.palette);
            } while (this.color1 == this.color2);
        } else if (colorStrategy === 'adjacent') {
            this.color1 = this.color2; // reuse previous color
            if (this.color1 === undefined) this.color1 = random(this.palette);
            do {
                this.color2 = randomElement(this.palette);
            } while (this.color1 == this.color2);
        } else {
            console.log('invalid color strategy ' + colorStrategy);
        }
    }
    description = `Each tile is divided by a diagonal, either from the upper left to lower right or from the upper right to the lower left. Each half is filled randomly white, grey or black. The "adjacent" color choice strategy uses a color from the previous tile.`;
    createdDate = '2022-12-07';
}
new Work0018().run();